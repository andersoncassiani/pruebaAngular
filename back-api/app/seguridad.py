from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import CLAVE_SECRETA, ALGORITMO, MINUTOS_TOKEN
from app.database import obtener_db
from app.usuarios.modelo import Usuario


# --- Contraseñas ---

def encriptar_clave(clave: str) -> str:
    return bcrypt.hashpw(clave.encode(), bcrypt.gensalt()).decode()


def verificar_clave(clave: str, clave_encriptada: str) -> bool:
    return bcrypt.checkpw(clave.encode(), clave_encriptada.encode())


# --- Token JWT ---

def crear_token(usuario_id: str) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=MINUTOS_TOKEN)
    datos = {"sub": usuario_id, "exp": expira}
    return jwt.encode(datos, CLAVE_SECRETA, algorithm=ALGORITMO)


# Lee el header "Authorization: Bearer <token>"
esquema_token = HTTPBearer()


# Se usa en las rutas protegidas: valida el token y devuelve el usuario logueado
def usuario_actual(
    credenciales: HTTPAuthorizationCredentials = Depends(esquema_token),
    db: Session = Depends(obtener_db),
) -> Usuario:
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
    )

    try:
        datos = jwt.decode(credenciales.credentials, CLAVE_SECRETA, algorithms=[ALGORITMO])
        usuario_id = datos.get("sub")
    except jwt.InvalidTokenError:
        raise error

    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise error

    # 👇 Si el admin lo desactivó, el token deja de servir aunque no haya expirado
    if not usuario.activo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tu cuenta está desactivada")

    return usuario


# 👇 Igual que usuario_actual, pero además exige que sea admin
def solo_admin(usuario: Usuario = Depends(usuario_actual)) -> Usuario:
    if usuario.rol != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo el administrador puede hacer esto")
    return usuario