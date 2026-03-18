import os
import pickle
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from app.core.conf import settings

# Global variables to hold model and tokenizer
model = None
tokenizer = None
MAX_SEQUENCE_LENGTH = 200

def load_ml_model():
    global model, tokenizer
    # Get the parent directory of 'app' (the project root)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    model_path = os.path.join(base_dir, "ml", "model.h5")
    tokenizer_path = os.path.join(base_dir, "ml", "tokenizer.pickle")

    try:
        if os.path.exists(model_path):
            model = load_model(model_path)
            print("Model loaded successfully.")
        else:
            print(f"Model file not found at {model_path}. Using mock prediction.")

        if os.path.exists(tokenizer_path):
            with open(tokenizer_path, 'rb') as handle:
                tokenizer = pickle.load(handle)
            print("Tokenizer loaded successfully.")
        else:
            print(f"Tokenizer file not found at {tokenizer_path}. Using mock tokenization.")
            
    except Exception as e:
        print(f"Error loading model/tokenizer: {e}")

def predict_job_post(text: str):
    global model, tokenizer
    
    # Preprocessing
    # clean_text = clean_text_func(text) # Implement cleaning if needed

    if model and tokenizer:
        sequences = tokenizer.texts_to_sequences([text])
        data = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)
        prediction = model.predict(data)
        score = float(prediction[0][0])
        # Assuming 1 is Fake, 0 is Real based on user prompt ("0 (Real) or 1 (Fraudulent)")
        # Generally sigmoid output: > 0.5 is 1 (Fake), < 0.5 is 0 (Real)
        is_fake = score > 0.5
        confidence = score if is_fake else 1 - score
        return "Fake" if is_fake else "Real", confidence
    else:
        # Mock prediction for development
        print("Using mock prediction logic.")
        import random
        score = random.random()
        return "Fake" if score > 0.5 else "Real", score
