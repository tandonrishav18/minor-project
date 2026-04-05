def generate_labels(df):
    """
    Ensures true_label exists
    If not → fallback using anomaly_flag (for real datasets)
    """
    if "true_label" not in df.columns:
        df["true_label"] = df["anomaly_flag"]
    return df