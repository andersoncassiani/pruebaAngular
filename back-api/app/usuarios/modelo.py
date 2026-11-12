import uuid

from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship  

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = Column(String(100), nullable=False)
    correo = Column(String(150), unique=True, index=True, nullable=False)
    clave = Column(String(255), nullable=False)  # se guarda encriptada
    rol = Column(String(20), nullable=False, default="usuario")  # usuario | admin
    activo = Column(Boolean, nullable=False, default=True)  # el admin puede desactivarlo
    creado_en = Column(DateTime, server_default=func.now())

    # 👇 Un usuario tiene muchos reportes (usuario.reportes)
    reportes = relationship("Reporte", back_populates="usuario", passive_deletes=True)