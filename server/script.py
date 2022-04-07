import sys
from sentence_transformers import SentenceTransformer
from nltk import sent_tokenize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import nltk
nltk.download('punkt')

base_document = open("ModelAnswer.txt", "r+").read()
documents = open("StudentAnswer.txt", "r+").read().split("\n")

documents.pop()


def process_bert_similarity():

    # This will download and load the pretrained model offered by UKPLab.
    model = SentenceTransformer('bert-base-nli-mean-tokens')

    # Although it is not explicitly stated in the official document of sentence transformer, the original BERT is meant for a shorter sentence. We will feed the model by sentences instead of the whole documents.
    sentences = sent_tokenize(base_document)
    base_embeddings_sentences = model.encode(sentences)
    base_embeddings = np.mean(np.array(base_embeddings_sentences), axis=0)

    vectors = []
    for i, document in enumerate(documents):

        sentences = sent_tokenize(document)
        embeddings_sentences = model.encode(sentences)
        embeddings = np.mean(np.array(embeddings_sentences), axis=0)

        vectors.append(embeddings)

        # print("making vector at index:", i)

    scores = cosine_similarity([base_embeddings], vectors).flatten()

    highest_score = 0
    highest_score_index = 0
    for i, score in enumerate(scores):
        if highest_score < score:
            highest_score = score
            highest_score_index = i

    most_similar_document = documents[highest_score_index]
    for x in scores:
        print(x)
    # print("Most similar document by BERT with the score:", most_similar_document, highest_score)


process_bert_similarity()
