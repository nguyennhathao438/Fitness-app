from fastapi import FastAPI
import joblib

app = FastAPI()

model = joblib.load("intent_model.pkl")

@app.post("/predict")
def predict(data: dict):
    text = data["text"]
    intent = model.predict([text])[0]
    return {"intent": intent}