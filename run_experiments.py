from preprocessing import load_data_from_db, preprocess_pipeline
from labeling import generate_labels
from split import train_test_split
from evaluation import evaluate_all_models
from stats import compute_significance
from logger import log_experiment
from export import export_csv

# -------------------------------
# LOAD + PREPROCESS
# -------------------------------
df = load_data_from_db()
df = preprocess_pipeline(df)

# -------------------------------
# LABELS
# -------------------------------
df = generate_labels(df)

# -------------------------------
# SPLIT
# -------------------------------
train_df, test_df = train_test_split(df)

# -------------------------------
# EVALUATION
# -------------------------------
results = evaluate_all_models(test_df)

print("\nMODEL RESULTS:")
for model, metrics in results.items():
    print(model, metrics)

# -------------------------------
# STATISTICAL TEST (example)
# -------------------------------
if "hybrid" in results and "ml" in results:
    hybrid_scores = [results["hybrid"]["f1"]] * 5
    ml_scores = [results["ml"]["f1"]] * 5

    stats = compute_significance(hybrid_scores, ml_scores)
    print("\nSTAT TEST:", stats)

# -------------------------------
# LOGGING
# -------------------------------
log_experiment({
    "results": results
})

# -------------------------------
# EXPORT
# -------------------------------
export_csv(df)