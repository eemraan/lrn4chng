import os
from pathlib import Path
from fastapi import APIRouter, File, Form, UploadFile, status, HTTPException
import aiofiles
import shutil

router = APIRouter(
    prefix="/camera",
    tags=["Camera Image Processing"]
)

# Base directory path for saved capture images
BASE_DIR = Path(__file__).resolve().parent.parent  # Adjust .parent steps to reach project root
BASE_IMAGE_DIR = BASE_DIR / "images" / "img_cap"


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_and_save_image(
    uid: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # 1. Reset file pointer in case stream was already read elsewhere
        await file.seek(0)

        # 2. Ensure target directory exists
        user_image_dir = BASE_IMAGE_DIR / uid
        user_image_dir.mkdir(parents=True, exist_ok=True)

        # 3. Determine file path
        file_extension = Path(file.filename).suffix if file.filename else ".jpg"
        destination_path = user_image_dir / f"image{file_extension}"

        # 4. Stream file contents synchronously to disk
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Print to terminal console for debugging
        print(f"[SUCCESS] File saved at: {destination_path.resolve()}")

        return {
            "status": "success",
            "message": "Image uploaded and saved successfully",
            "data": {
                "uid": uid,
                "saved_path": str(destination_path.resolve()),
                "filename": destination_path.name
            }
        }

    except Exception as e:
        print(f"[ERROR] Failed to save file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving image: {str(e)}"
        )