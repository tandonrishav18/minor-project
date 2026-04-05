import pandas as pd

def train_test_split(df, ratio=0.7):
    split_idx = int(len(df) * ratio)
    train = df.iloc[:split_idx].reset_index(drop=True)
    test = df.iloc[split_idx:].reset_index(drop=True)
    return train, test