from pydantic import BaseModel, Field

from app.reportes.esquemas import Estado, ReporteRespuesta


class CambiarEstadoUsuario(BaseModel):
    activo: bool


class CambiarClave(BaseModel):
    clave: str = Field(min_length=6)


class CambiarEstadoReporte(BaseModel):
    estado: Estado


# Datos mínimos de quién hizo el reporte
class Autor(BaseModel):
    nombre: str
    correo: str


# El admin ve el reporte y además quién lo hizo
class ReporteAdminRespuesta(ReporteRespuesta):
    usuario: Autor