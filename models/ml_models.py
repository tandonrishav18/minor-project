import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler

# -------------------------------
# FEATURE PREPARATION
# -------------------------------
def get_features(df):
    return df[[
        "temperature",
        "humidity",
        "aqi",
        "temporal_score",
        "spatial_score",
        "rate_score"
    ]].values


# -------------------------------
# SCALER
# -------------------------------
def fit_scaler(X_train):
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    return scaler, X_train_scaled


def transform_scaler(scaler, X_test):
    return scaler.transform(X_test)


# -------------------------------
# ISOLATION FOREST
# -------------------------------
def train_isolation_forest(X_train):
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X_train)
    return model


def predict_isolation_forest(model, X_test):
    preds = model.predict(X_test)
    return np.where(preds == -1, 1, 0)


# -------------------------------
# LOCAL OUTLIER FACTOR
# -------------------------------
def predict_lof(X_test):
    model = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
    preds = model.fit_predict(X_test)
    return np.where(preds == -1, 1, 0)


# -------------------------------
# ONE-CLASS SVM
# -------------------------------
def train_svm(X_train):
    model = OneClassSVM(nu=0.1, kernel="rbf", gamma="scale")
    model.fit(X_train)
    return model


def predict_svm(model, X_test):
    preds = model.predict(X_test)
    return np.where(preds == -1, 1, 0)