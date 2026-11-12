import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
CLAVE_SECRETA = os.getenv("CLAVE_SECRETA")
ALGORITMO = "HS256"
MINUTOS_TOKEN = int(os.getenv("MINUTOS_TOKEN", 60))