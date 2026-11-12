import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.usuarios.rutas import router as usuarios_router
from app.reportes.rutas import router as reportes_router
from app.admin.rutas import router as admin_router

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reportemos API")

# Permite que Angular (puerto 4200) consuma la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sirve las fotos: http://localhost:8000/uploads/reportes/archivo.jpg
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Módulos
app.include_router(usuarios_router)
app.include_router(reportes_router)
app.include_router(admin_router)


@app.get("/")
def inicio():
    return {"mensaje": "Reportemos API funcionando"}