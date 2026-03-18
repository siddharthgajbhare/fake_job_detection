import pytest
from unittest.mock import MagicMock, patch
import sys

# Mocking heavy dependencies to run tests without them locally
mock_tf = MagicMock()
sys.modules["tensorflow"] = mock_tf
sys.modules["tensorflow.keras.models"] = mock_tf
sys.modules["tensorflow.keras.preprocessing.sequence"] = mock_tf

# Mocking database to avoid connection errors during test collection
sys.modules["beanie"] = MagicMock()
sys.modules["motor"] = MagicMock()

from app.services.ml_service import load_ml_model, predict_job_post

def test_load_ml_model():
    with patch("os.path.exists", return_value=True), \
         patch("builtins.open", MagicMock()), \
         patch("pickle.load", return_value=MagicMock()):
        load_ml_model()

def test_predict_job_post_real():
    # Sample real-looking job text
    text = "We are looking for a Software Engineer with experience in Python and FastAPI."
    label, confidence = predict_job_post(text)
    assert label in ["Real", "Fake"]
    assert 0 <= confidence <= 1

def test_predict_job_post_fake():
    # Sample fake-looking job text (scam-like)
    text = "EARN $5000 PER WEEK WORKING FROM HOME!!! NO EXPERIENCE NEEDED!!! JUST PAY $50 FOR REGISTRATION!!!"
    label, confidence = predict_job_post(text)
    assert label in ["Real", "Fake"]
    assert 0 <= confidence <= 1
