from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import fuzz

def recommend_jobs(data, tfidf_matrix, tfidf, job_title, work_types, salary, top_n=10):
    # Filter by work types (list)
    if isinstance(work_types, str):
        work_types = [work_types]
    df = data[data['Work Type'].isin(work_types)].copy()

    if df.empty:
        return []

    # Fuzzy match title
    df['title_match'] = df['Job Title'].apply(lambda x: fuzz.partial_ratio(job_title.lower(), x.lower()) / 100.0)

    # Salary proximity (±10%)
    df['salary_match'] = (df['salary_inr'] >= salary * 0.9) & (df['salary_inr'] <= salary * 1.1)
    df['salary_diff'] = abs(df['salary_inr'] - salary)

    # Cosine similarity for job title
    query_vec = tfidf.transform([job_title.lower()])
    indices = df.index.tolist()
    cosine_sim = cosine_similarity(query_vec, tfidf_matrix[indices]).flatten()
    df['similarity_score'] = cosine_sim

    # Relevance score: prioritize title match
    df['relevance'] = df['title_match'] * 0.6 + df['similarity_score'] * 0.3 + df['salary_match'].astype(int) * 0.1

    # Sort by title match first, then relevance, then salary diff
    df = df.sort_values(by=['title_match', 'relevance', 'salary_diff'], ascending=[False, False, True])

    # Select top_n
    top_jobs = df.head(top_n)

    # Return dict with required fields
    return top_jobs[['Job Title', 'Company', 'location', 'Work Type', 'salary_inr']].to_dict(orient='records')
