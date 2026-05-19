# -*- coding: utf-8 -*-
"""
Script principal del sistema de recomendación.
Carga datos, construye features, calcula similitud y ejecuta recomendaciones.
"""

import json
import pandas as pd
from recomendador import (
    transformar_features, MatrizFeatures,
    calcular_similitud, recomendar_recetas
)

# --- Pipeline ---
recipes = pd.read_csv('recetas1.csv', sep=',', encoding='utf-8-sig')
df = transformar_features(recipes)
mf = MatrizFeatures()
mf.construir_matriz_features(df)
sim_matrix = calcular_similitud(mf.matriz_)

# --- Usuario de ejemplo ---
usuario = {
    "recetas_favoritas": [12, 35, 48],
    "dieta": "Vegetariano",
    "alergenos": ["Huevo", "Maní"],
    "nivel_dificultad": "Principiante"
}

resultado = recomendar_recetas(usuario, df, sim_matrix, top_n=5)
print(json.dumps(resultado, indent=2, ensure_ascii=False))