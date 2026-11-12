from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import DATABASE_URL

# Conexión a MySQL
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Fábrica de sesiones para hablar con la base de datos
SesionLocal = sessionmaker(bind=engine, autoflush=False)

# Clase base de la que heredan todos los modelos (tablas)
Base = declarative_base()


# Abre una sesión por petición y la cierra al terminar
def obtener_db():
    db = SesionLocal()
    try:
        yield db
    finally:
        db.close()