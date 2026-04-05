import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import f1_score

def robustness_noise(df):

    y_true = df["true_label"]

    noise_levels = [0, 0.1, 0.2, 0.3, 0.4]
    scores = []

    for noise in noise_levels:
        noisy_temp = df["temperature"] + np.random.normal(0, noise * 5, len(df))

        score = abs(noisy_temp - df["temperature"].mean())
        pred = (score > 3).astype(int)

        f1 = f1_score(y_true, pred)
        scores.append(f1)

    plt.plot(noise_levels, scores, marker="o")
    plt.xlabel("Noise Level")
    plt.ylabel("F1 Score")
    plt.title("Robustness to Noise")
    plt.savefig("robustness.png")
    plt.show()