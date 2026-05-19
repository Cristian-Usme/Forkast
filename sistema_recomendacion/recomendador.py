# -*- coding: utf-8 -*-
"""
=============================================================================
SISTEMA DE RECOMENDACIÓN DE RECETAS BASADO EN CONTENIDO
=============================================================================
Recomendador content-based que utiliza recetas favoritas del usuario
como núcleo de similitud, filtrando por dieta, alérgenos y dificultad.

Entrada del usuario:
  - recetas_favoritas: lista de índices de recetas
  - dieta: string con la dieta del usuario
  - alergenos: lista de alérgenos a excluir
  - nivel_dificultad: string con el nivel preferido

Salida:
  - Lista de dicts con id_receta y score
"""

import re
import warnings
import numpy as np
import pandas as pd
from scipy import sparse

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords

warnings.filterwarnings('ignore')

# ============================================================================
# CONSTANTES NLP
# ============================================================================

STOPWORDS_ES = set(stopwords.words('spanish'))
UNIDADES = {
    'g', 'kg', 'ml', 'l', 'litro', 'litros', 'taza', 'tazas',
    'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas',
    'tajada', 'tajadas', 'loncha', 'lonchas', 'presa', 'presas',
    'diente', 'dientes', 'lata', 'pastilla', 'pastillas',
    'hoja', 'hojas', 'trozo', 'trozos', 'rodaja', 'rodajas',
    'unidad', 'unidades', 'porción', 'porciones', 'mediana',
    'medianas', 'grande', 'grandes', 'pequeña', 'pequeñas'
}
RELLENO = {
    'al', 'gusto', 'opcional', 'cocido', 'cocidos', 'cocida',
    'cocidas', 'picado', 'picada', 'picados', 'rallado', 'rallada',
    'natural', 'firme', 'anterior', 'día', 'corta', 'integral',
    'doble', 'crema', 'polvo', 'hornear', 'freír', 'para'
}
STEMMER = SnowballStemmer('spanish')


# ============================================================================
# 1. PREPROCESAMIENTO
# ============================================================================

def limpiar_ingredientes(texto: str) -> list:
    """
    Pipeline NLP para limpiar ingredientes.
    Tokeniza, normaliza, elimina stopwords/unidades y aplica stemming.
    """
    if not isinstance(texto, str):
        return []

    ingredientes_limpios = []
    for item in texto.split(','):
        item = item.strip().lower()
        item = re.sub(r'\d+[/.]?\d*', '', item)
        item = re.sub(r'[^\wáéíóúñü\s]', '', item)
        tokens = [
            STEMMER.stem(t) for t in item.split()
            if t not in STOPWORDS_ES
            and t not in UNIDADES
            and t not in RELLENO
            and len(t) > 1
        ]
        ingredientes_limpios.extend(tokens)

    # Deduplicar preservando orden
    vistos = set()
    return [t for t in ingredientes_limpios if not (t in vistos or vistos.add(t))]


def parsear_multi_label(texto: str) -> list:
    """Separa campos multi-valor: 'A, B' → ['A', 'B']."""
    if not isinstance(texto, str):
        return []
    return [x.strip() for x in texto.split(',') if x.strip()]


def transformar_features(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica preprocesamiento completo al DataFrame."""
    df = df.copy()
    df['ingredientes_limpios'] = df['ingredientes'].apply(limpiar_ingredientes)
    df['ingredientes_texto'] = df['ingredientes_limpios'].apply(' '.join)
    df['dietas_lista'] = df['dieta_compatible'].apply(parsear_multi_label)
    df['alergenos_lista'] = df['alergenos_presentes'].apply(parsear_multi_label)
    df['alergenos_lista'] = df['alergenos_lista'].apply(
        lambda x: [] if x == ['Ninguno'] else x
    )
    return df


# ============================================================================
# 2. MATRIZ DE FEATURES
# ============================================================================

class MatrizFeatures:
    """
    Construye la matriz combinada de features para todas las recetas.
    Componentes: TF-IDF ingredientes, one-hot cocina/comida/dificultad,
    multi-label dieta/alérgenos, tiempo normalizado.
    """

    PESOS = {
        'ingredientes': 0.40,
        'tipo_cocina': 0.10,
        'tipo_comida': 0.10,
        'dieta': 0.15,
        'alergenos': 0.05,
        'dificultad': 0.10,
        'tiempo': 0.10
    }

    def __init__(self):
        self.tfidf = TfidfVectorizer(max_features=200, ngram_range=(1, 2))
        self.mlb_dieta = MultiLabelBinarizer()
        self.mlb_alerg = MultiLabelBinarizer()
        self.scaler_tiempo = MinMaxScaler()
        self.matriz_ = None

    def construir_matriz_features(self, df: pd.DataFrame):
        """Construye y retorna la matriz combinada ponderada."""
        p = self.PESOS

        mat_tfidf = self.tfidf.fit_transform(df['ingredientes_texto'])
        mat_cocina = pd.get_dummies(df['tipo_cocina']).values
        mat_comida = pd.get_dummies(df['tipo_comida']).values
        mat_dif = pd.get_dummies(df['nivel_dificultad']).values
        mat_dieta = self.mlb_dieta.fit_transform(df['dietas_lista'])
        mat_alerg = self.mlb_alerg.fit_transform(df['alergenos_lista'])
        mat_tiempo = self.scaler_tiempo.fit_transform(
            df[['tiempo_total_min']].values
        )

        componentes = [
            sparse.csr_matrix(mat_tfidf * p['ingredientes']),
            sparse.csr_matrix(mat_cocina * p['tipo_cocina']),
            sparse.csr_matrix(mat_comida * p['tipo_comida']),
            sparse.csr_matrix(mat_dieta * p['dieta']),
            sparse.csr_matrix(mat_alerg * p['alergenos']),
            sparse.csr_matrix(mat_dif * p['dificultad']),
            sparse.csr_matrix(mat_tiempo * p['tiempo']),
        ]

        self.matriz_ = sparse.hstack(componentes)
        return self.matriz_


# ============================================================================
# 3. SIMILITUD
# ============================================================================

def calcular_similitud(matriz) -> np.ndarray:
    """Calcula la matriz de similitud coseno entre todas las recetas."""
    return cosine_similarity(matriz)


# ============================================================================
# 4. RECOMENDACIÓN
# ============================================================================

def _validar_usuario(usuario: dict, df: pd.DataFrame):
    """Valida la estructura del perfil de usuario."""
    if not isinstance(usuario.get('recetas_favoritas'), list):
        raise ValueError("'recetas_favoritas' debe ser una lista de índices.")
    if not usuario['recetas_favoritas']:
        raise ValueError("'recetas_favoritas' no puede estar vacía.")

    max_idx = len(df) - 1
    invalidos = [i for i in usuario['recetas_favoritas'] if i < 0 or i > max_idx]
    if invalidos:
        raise ValueError(
            f"Índices fuera de rango: {invalidos}. Rango válido: 0-{max_idx}"
        )


def filtrar_restricciones(df: pd.DataFrame, usuario: dict) -> pd.Series:
    """
    Genera máscara booleana excluyendo recetas incompatibles.
    Filtra por: alérgenos, dieta, recetas ya favoritas.
    """
    mask = pd.Series(True, index=df.index)

    # Excluir alérgenos del usuario
    alergenos_usuario = [a.lower() for a in usuario.get('alergenos', [])]
    if alergenos_usuario:
        mask &= df['alergenos_lista'].apply(
            lambda als: not any(
                a in [x.lower() for x in als] for a in alergenos_usuario
            )
        )

    # Filtrar por compatibilidad de dieta
    dieta = usuario.get('dieta', '')
    if dieta:
        mask &= df['dietas_lista'].apply(lambda ds: dieta in ds)

    # Excluir recetas que ya son favoritas
    favoritas = usuario.get('recetas_favoritas', [])
    mask &= ~df.index.isin(favoritas)

    return mask


def recomendar_recetas(usuario: dict, df: pd.DataFrame,
                       sim_matrix: np.ndarray, top_n: int = 5) -> list:
    """
    Recomienda recetas basándose en similitud con las favoritas del usuario.

    Proceso:
      1. Promedia los vectores de similitud de las recetas favoritas
      2. Aplica filtros de restricciones (alérgenos, dieta)
      3. Bonifica recetas del mismo nivel de dificultad
      4. Retorna top-N como lista de {id_receta, score}

    Args:
        usuario: dict con recetas_favoritas, dieta, alergenos, nivel_dificultad
        df: DataFrame preprocesado
        sim_matrix: matriz de similitud coseno precalculada
        top_n: número de recomendaciones

    Returns:
        Lista de dicts [{id_receta: int, score: float}, ...]
    """
    _validar_usuario(usuario, df)

    favoritas = usuario['recetas_favoritas']

    # Perfil = promedio de vectores de similitud de las favoritas
    scores = np.mean(sim_matrix[favoritas], axis=0)

    # Aplicar filtros
    mask = filtrar_restricciones(df, usuario)

    resultados = pd.DataFrame({
        'idx': df.index,
        'score': scores
    })
    resultados = resultados[mask.values]

    # Bonificar mismo nivel de dificultad (+5%)
    nivel = usuario.get('nivel_dificultad', '')
    if nivel:
        bonus = df.loc[resultados['idx'], 'nivel_dificultad'].values == nivel
        resultados = resultados.copy()
        resultados.loc[bonus, 'score'] *= 1.05

    # Ordenar y seleccionar top-N
    resultados = resultados.sort_values('score', ascending=False).head(top_n)

    # Mapear índice a id_receta
    return [
        {
            "id_receta": int(df.loc[row['idx'], 'id_receta']),
            "score": round(row['score'], 4)
        }
        for _, row in resultados.iterrows()
    ]
