from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import obtener_db
from app.fotos import guardar_foto, borrar_foto
from app.seguridad import usuario_actual
from app.usuarios.modelo import Usuario
from app.reportes.modelo import Reporte
from app.reportes.esquemas import ReporteCrear, ReporteEditar, ReporteRespuesta

# Todas las rutas de este archivo empiezan por /reportes y piden token
router = APIRouter(prefix="/reportes", tags=["Reportes"])


# Busca un reporte que sea del usuario logueado. Si no existe o es de otro, 404
def buscar_reporte(reporte_id: str, usuario: Usuario, db: Session) -> Reporte:
    reporte = (
        db.query(Reporte)
        .filter(Reporte.id == reporte_id, Reporte.usuario_id == usuario.id)
        .first()
    )
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return reporte


# Listar mis reportes (los más nuevos primero)
@router.get("", response_model=list[ReporteRespuesta])
def listar(usuario: Usuario = Depends(usuario_actual), db: Session = Depends(obtener_db)):
    return (
        db.query(Reporte)
        .filter(Reporte.usuario_id == usuario.id)
        .order_by(Reporte.creado_en.desc())
        .all()
    )


# Ver un reporte
@router.get("/{reporte_id}", response_model=ReporteRespuesta)
def ver(reporte_id: str, usuario: Usuario = Depends(usuario_actual), db: Session = Depends(obtener_db)):
    return buscar_reporte(reporte_id, usuario, db)


# Crear reporte. Llega como formulario (multipart) porque puede traer una foto
@router.post("", response_model=ReporteRespuesta, status_code=status.HTTP_201_CREATED)
async def crear(
    datos: Annotated[ReporteCrear, Form()],
    foto: Optional[UploadFile] = File(None),
    usuario: Usuario = Depends(usuario_actual),
    db: Session = Depends(obtener_db),
):
    ruta_foto = await guardar_foto(foto) if foto else None

    reporte = Reporte(**datos.model_dump(), foto=ruta_foto, usuario_id=usuario.id)
    db.add(reporte)
    db.commit()
    db.refresh(reporte)
    return reporte


# Editar reporte (solo los campos que lleguen)
@router.put("/{reporte_id}", response_model=ReporteRespuesta)
def editar(
    reporte_id: str,
    datos: ReporteEditar,
    usuario: Usuario = Depends(usuario_actual),
    db: Session = Depends(obtener_db),
):
    reporte = buscar_reporte(reporte_id, usuario, db)

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(reporte, campo, valor)

    db.commit()
    db.refresh(reporte)
    return reporte


# Eliminar reporte (y su foto del disco)
@router.delete("/{reporte_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(reporte_id: str, usuario: Usuario = Depends(usuario_actual), db: Session = Depends(obtener_db)):
    reporte = buscar_reporte(reporte_id, usuario, db)
    borrar_foto(reporte.foto)
    db.delete(reporte)
    db.commit()