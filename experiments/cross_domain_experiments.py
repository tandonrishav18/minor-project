import pandas as pd
from cross_domain import convert_to_standard
from evaluation import evaluate_all_models

def run_cross_domain(file_path, domain="stock"):

    df = pd.read_csv(file_path)

    df = convert_to_standard(df, domain)

    # fake labels (for now)
    df["true_label"] = (df["temperature"].diff().abs() > df["temperature"].std()).astype(int)

    results = evaluate_all_models(df)

    print("\nCROSS DOMAIN RESULTS:")
    for k, v in results.items():
        print(k, v)

    return results