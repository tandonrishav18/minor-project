import pandas as pd

def export_csv(df, filename="dataset_export.csv"):
    df.to_csv(filename, index=False)
    print(f"Exported → {filename}")