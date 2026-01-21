import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def load_data(path='../dataset/preprocessed_jobs.csv'):
    data = pd.read_csv(path)

    # Combine Job Title for TF-IDF (you only have 5 columns)
    data['combined_text'] = data['Job Title'].str.lower().fillna('')

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(data['combined_text'])

    return data, tfidf_matrix, tfidf
