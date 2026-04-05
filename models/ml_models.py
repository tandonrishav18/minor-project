import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler


# -------------------------------
# FEATURE PREP
# -------------------------------
def prepare_features(df):
    X = df[[
        "temperature", "humidity", "aqi",
        "temporal_score", "spatial_score", "rate_score"
    ]].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled


# -------------------------------
# ISOLATION FOREST
# -------------------------------
def isolation_forest_model(df):
    X = prepare_features(df)

    model = IsolationForest(contamination=0.1, random_state=42)
    preds = model.fit_predict(X)

    return np.where(preds == -1, 1, 0)


# -------------------------------
# LOCAL OUTLIER FACTOR
# -------------------------------
def lof_model(df):
    X = prepare_features(df)

    model = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
    preds = model.fit_predict(X)

    return np.where(preds == -1, 1, 0)


# -------------------------------
# ONE CLASS SVM
# -------------------------------
def svm_model(df):
    X = prepare_features(df)

    model = OneClassSVM(nu=0.1, kernel="rbf", gamma="scale")
    preds = model.fit(X).predict(X)

    return np.where(preds == -1, 1, 0)