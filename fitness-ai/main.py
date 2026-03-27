import io
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import joblib

app = FastAPI()

# ===== Intent model =====
intent_model = joblib.load("intent_model.pkl")

# ===== Food model =====
FOOD_MODEL_PATH = "food101_model_continued_v3.keras"  
CLASS_NAMES_PATH = "class_names.txt"
IMG_SIZE = (224, 224)

food_model = tf.keras.models.load_model(FOOD_MODEL_PATH)

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f if line.strip()]


def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)
    return image_array


@app.get("/")
def home():
    return {
        "message": "API is running",
        "intent_model": "intent_model.pkl",
        "food_model": FOOD_MODEL_PATH,
        "num_food_classes": len(class_names)
    }



@app.post("/predict")
def predict(data: dict):
    text = data["text"]
    intent = intent_model.predict([text])[0]
    return {"intent": intent}


# ===== API mới cho food =====
@app.post("/predict-food")
async def predict_food(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        input_tensor = preprocess_image(image_bytes)

        predictions = food_model.predict(input_tensor)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        predicted_label = class_names[predicted_index]

        top_5_indices = np.argsort(predictions[0])[::-1][:5]
        top_5 = [
            {
                "label": class_names[i],
                "confidence": float(predictions[0][i])
            }
            for i in top_5_indices
        ]

        return JSONResponse(
            content={
                "filename": file.filename,
                "predicted_label": predicted_label,
                "confidence": confidence,
                "top_5": top_5
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )