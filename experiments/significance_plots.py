import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import ttest_ind

def significance_test_plot(hybrid_scores, ml_scores):

    t_stat, p_value = ttest_ind(hybrid_scores, ml_scores)

    print("T-Statistic:", t_stat)
    print("P-Value:", p_value)

    labels = ["Hybrid", "ML"]
    means = [np.mean(hybrid_scores), np.mean(ml_scores)]

    plt.bar(labels, means)
    plt.title(f"Statistical Comparison (p={p_value:.4f})")
    plt.savefig("stat_significance.png")
    plt.show()

    return p_value