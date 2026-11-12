from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

# Solo se permiten estos dos estados
Estado = Literal["pendiente", "recogido"]


# Lo que llega al crear (viene como formulario porque trae la foto)
class ReporteCrear(BaseModel):
    titulo: str = Field(min_length=5, max_length=150)
    descripcion: str = Field(min_length=10)
    direccion: str = Field(min_length=5, max_length=200)


# Lo que llega al editar. El estado ya no está: solo lo cambia el admin
class ReporteEditar(BaseModel):
    titulo: Optional[str] = Field(default=None, min_length=5, max_length=150)
    descripcion: Optional[str] = Field(default=None, min_length=10)
    direccion: Optional[str] = Field(default=None, min_length=5, max_length=200)


# Lo que se devuelve
class ReporteRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    titulo: str
    descripcion: str
    direccion: str
    foto: Optional[str]
    estado: Estado
    creado_en: datetime