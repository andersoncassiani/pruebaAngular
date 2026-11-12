import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.database import Base


class Reporte(Base):
    __tablename__ = "reportes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    titulo = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=False)
    direccion = Column(String(200), nullable=False)
    foto = Column(String(255), nullable=True)  # ruta de la imagen, no la imagen
    estado = Column(String(20), nullable=False, default="pendiente")  # pendiente | recogido
    creado_en = Column(DateTime, server_default=func.now())

    # Dueño del reporte. Si se borra el usuario, se borran sus reportes
    usuario_id = Column(String(36), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)

    #Cada reporte pertenece a un usuario (reporte.usuario)
    usuario = relationship("Usuario", back_populates="reportes")