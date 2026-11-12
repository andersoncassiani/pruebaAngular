from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import obtener_db
from app.seguridad import solo_admin, encriptar_clave
from app.usuarios.modelo import Usuario
from app.usuarios.esquemas import UsuarioRespuesta
from app.reportes.modelo import Reporte
from app.reportes.esquemas import Estado
from app.admin.esquemas import (
    CambiarEstadoUsuario,
    CambiarClave,
    CambiarEstadoReporte,
    ReporteAdminRespuesta,
)

# Todas las rutas empiezan por /admin y solo las puede usar un admin
router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(solo_admin)])


def buscar_usuario(usuario_id: str, db: Session) -> Usuario:
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# --- Usuarios ---

@router.get("/usuarios", response_model=list[UsuarioRespuesta])
def listar_usuarios(db: Session = Depends(obtener_db)):
    return db.query(Usuario).order_by(Usuario.creado_en.desc()).all()


# Activar o desactivar un usuario
@router.put("/usuarios/{usuario_id}/estado", response_model=UsuarioRespuesta)
def cambiar_estado_usuario(
    usuario_id: str,
    datos: CambiarEstadoUsuario,
    admin: Usuario = Depends(solo_admin),
    db: Session = Depends(obtener_db),
):
    usuario = buscar_usuario(usuario_id, db)

    # Evita que el admin se bloquee a sí mismo
    if usuario.id == admin.id:
        raise HTTPException(status_code=400, detail="No puedes desactivar tu propia cuenta")

    usuario.activo = datos.activo
    db.commit()
    db.refresh(usuario)
    return usuario


# El admin le pone una clave nueva y se la comunica al usuario
@router.put("/usuarios/{usuario_id}/clave")
def cambiar_clave(usuario_id: str, datos: CambiarClave, db: Session = Depends(obtener_db)):
    usuario = buscar_usuario(usuario_id, db)
    usuario.clave = encriptar_clave(datos.clave)
    db.commit()
    return {"mensaje": "Clave actualizada"}


# --- Reportes ---

# Todos los reportes de todos los usuarios. Se puede filtrar: /admin/reportes?estado=pendiente
@router.get("/reportes", response_model=list[ReporteAdminRespuesta])
def listar_reportes(estado: Optional[Estado] = None, db: Session = Depends(obtener_db)):
    consulta = db.query(Reporte)
    if estado:
        consulta = consulta.filter(Reporte.estado == estado)
    return consulta.order_by(Reporte.creado_en.desc()).all()


# Marcar un reporte como pendiente o recogido
@router.put("/reportes/{reporte_id}/estado", response_model=ReporteAdminRespuesta)
def cambiar_estado_reporte(reporte_id: str, datos: CambiarEstadoReporte, db: Session = Depends(obtener_db)):
    reporte = db.get(Reporte, reporte_id)
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    reporte.estado = datos.estado
    db.commit()
    db.refresh(reporte)
    return reporte