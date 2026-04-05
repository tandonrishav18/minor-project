from scipy.stats import ttest_ind

def compute_significance(model_a_scores, model_b_scores):

    t_stat, p_value = ttest_ind(model_a_scores, model_b_scores)

    return {
        "t_stat": t_stat,
        "p_value": p_value,
        "significant": p_value < 0.05
    }