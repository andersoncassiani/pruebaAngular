import os
import uuid

from fastapi import HTTPException, UploadFile

CARPETA = "uploads/reportes"
TIPOS_PERMITIDOS = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
TAMANO_MAXIMO = 5 * 1024 * 1024  # 5 MB


async def guardar_foto(foto: UploadFile) -> str:
    if foto.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(status_code=400, detail="La foto debe ser JPG, PNG o WEBP")

    contenido = await foto.read()
    if len(contenido) > TAMANO_MAXIMO:
        raise HTTPException(status_code=400, detail="La foto no puede pesar más de 5 MB")

    # Nombre único para que no se pisen fotos con el mismo nombre
    nombre = f"{uuid.uuid4()}.{TIPOS_PERMITIDOS[foto.content_type]}"
    os.makedirs(CARPETA, exist_ok=True)

    with open(os.path.join(CARPETA, nombre), "wb") as archivo:
        archivo.write(contenido)

    # En la BD guardamos la ruta pública, no el archivo
    return f"/{CARPETA}/{nombre}"


def borrar_foto(ruta: str | None):
    if ruta and os.path.exists(ruta.lstrip("/")):
        os.remove(ruta.lstrip("/"))