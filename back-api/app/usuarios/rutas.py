from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import obtener_db
from app.seguridad import encriptar_clave, verificar_clave, crear_token, usuario_actual
from app.usuarios.modelo import Usuario
from app.usuarios.esquemas import (
    UsuarioRegistro,
    UsuarioLogin,
    UsuarioRespuesta,
    TokenRespuesta,
)

router = APIRouter(tags=["Usuarios"])


@router.post("/registro", response_model=UsuarioRespuesta, status_code=status.HTTP_201_CREATED)
def registro(datos: UsuarioRegistro, db: Session = Depends(obtener_db)):
    # Validar que el correo no exista
    existe = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    usuario = Usuario(
        nombre=datos.nombre,
        correo=datos.correo,
        clave=encriptar_clave(datos.clave),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.post("/login", response_model=TokenRespuesta)
def login(datos: UsuarioLogin, db: Session = Depends(obtener_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == datos.correo).first()

    # Mismo mensaje para correo o clave incorrectos (no damos pistas)
    if not usuario or not verificar_clave(datos.clave, usuario.clave):
        raise HTTPException(status_code=401, detail="Correo o clave incorrectos")

    return {"token": crear_token(usuario.id), "usuario": usuario}


# Devuelve el usuario dueño del token (Angular lo usa para mostrar el nombre)
@router.get("/perfil", response_model=UsuarioRespuesta)
def perfil(usuario: Usuario = Depends(usuario_actual)):
    return usuario