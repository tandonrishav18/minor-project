def convert_to_standard(df, domain="generic"):

    df = df.copy()

    if domain == "stock":
        df["temperature"] = df["Close"]
        df["humidity"] = df["Close"].rolling(5).mean().fillna(df["Close"])
        df["aqi"] = df["Close"].diff().abs().fillna(0)

    elif domain == "network":
        df["temperature"] = df["bytes"]
        df["humidity"] = df["packets"]
        df["aqi"] = df["bytes"].diff().abs().fillna(0)

    return df