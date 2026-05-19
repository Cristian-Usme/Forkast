# -*- coding: utf-8 -*-
"""
Modulo de recomendacion.
Prepara features y ejecuta recomendaciones con entrada externa.
"""

import pandas as pd

from recomendador import (
    transformar_features, MatrizFeatures,
    calcular_similitud, recomendar_recetas
)


def preparar_recomendador(df: pd.DataFrame, calcular_sim: bool = True):
    """Prepara dataframe y matrices para recomendaciones."""
    df_pre = transformar_features(df)
    mf = MatrizFeatures()
    mf.construir_matriz_features(df_pre)
    sim_matrix = calcular_similitud(mf.matriz_) if calcular_sim else None
    return df_pre, sim_matrix


def recomendar(usuario: dict, df: pd.DataFrame, sim_matrix, top_n: int = 5):
    """Ejecuta recomendaciones dado un usuario y dataset preprocesado."""
    return recomendar_recetas(usuario, df, sim_matrix, top_n=top_n)