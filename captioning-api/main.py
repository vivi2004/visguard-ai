from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import torch
from transformers import (
    VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer,
    DetrImageProcessor, DetrForObjectDetection
)
import io
import logging

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Models
caption_model = None
caption_processor = None
caption_tokenizer = None
detection_model = None
detection_processor = None


@app.on_event("startup")
def load_models():
    global caption_model, caption_processor, caption_tokenizer
    global detection_model, detection_processor

    caption_model = VisionEncoderDecoderModel.from_pretrained(
        "nlpconnect/vit-gpt2-image-captioning").to(device)
    caption_processor = ViTImageProcessor.from_pretrained(
        "nlpconnect/vit-gpt2-image-captioning")
    caption_tokenizer = AutoTokenizer.from_pretrained(
        "nlpconnect/vit-gpt2-image-captioning")

    detection_processor = DetrImageProcessor.from_pretrained(
        "facebook/detr-resnet-50")
    detection_model = DetrForObjectDetection.from_pretrained(
        "facebook/detr-resnet-50").to(device)

    logging.info("Models loaded successfully.")


@app.post("/caption")  # ✅ Renamed this route for your backend
async def caption_and_detect(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Captioning
        caption_inputs = caption_processor(
            images=image, return_tensors="pt").to(device)
        output_ids = caption_model.generate(
            **caption_inputs, max_length=16, num_beams=1, do_sample=False, num_return_sequences=1)
        caption = caption_tokenizer.decode(
            output_ids[0], skip_special_tokens=True)

        # Object detection
        detection_inputs = detection_processor(
            images=image, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = detection_model(**detection_inputs)

        logits = outputs.logits[0]
        boxes = outputs.pred_boxes[0]

        threshold = 0.7
        detected_objects = []
        for logit, box in zip(logits, boxes):
            score = logit.softmax(-1)
            label_id = score.argmax().item()
            confidence = score[label_id].item()
            if label_id != detection_model.config.num_labels and confidence > threshold:
                label = detection_model.config.id2label[label_id]
                detected_objects.append({
                    "label": label,
                    "confidence": round(confidence * 100, 2)
                })

        return {
            "caption": caption,
            "objects": detected_objects
        }

    except UnidentifiedImageError:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})
    except Exception as e:
        logging.exception("Error processing image")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/")
def root():
    return {"message": "Caption + Object Detection API running 🚀"}
