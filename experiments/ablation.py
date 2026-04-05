import pandas as pd
import matplotlib.pyplot as plt
from evaluation import evaluate

def run_ablation(df):

    y_true = df["true_label"]

    results = {}

    results["Temporal"] = evaluate(y_true, (df["temporal_score"] > 2).astype(int))
    results["Spatial"] = evaluate(y_true, (df["spatial_score"] > 2).astype(int))
    results["Temporal+Spatial"] = evaluate(
        y_true,
        ((df["temporal_score"] + df["spatial_score"]) > 3).astype(int)
    )
    results["Full Hybrid"] = evaluate(y_true, df["anomaly_flag"])

    df_res = pd.DataFrame(results).T

    df_res["f1"].plot(kind="bar")
    plt.title("Ablation Study (Component Contribution)")
    plt.savefig("ablation.png")
    plt.show()

    return df_res