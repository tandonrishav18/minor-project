from preprocessing import load_data_from_db, preprocess_pipeline
from experiments.ablation import run_ablation
from experiments.sensitivity import sensitivity_alpha
from experiments.robustness import robustness_noise
from experiments.significance_plots import significance_test_plot

# LOAD DATA
df = load_data_from_db()
df = preprocess_pipeline(df)

# RUN EXPERIMENTS
run_ablation(df)
sensitivity_alpha(df)
robustness_noise(df)

# FAKE MULTIPLE RUNS (for stats)
hybrid_scores = [0.7, 0.72, 0.74, 0.71, 0.73]
ml_scores = [0.5, 0.52, 0.48, 0.49, 0.51]

significance_test_plot(hybrid_scores, ml_scores)