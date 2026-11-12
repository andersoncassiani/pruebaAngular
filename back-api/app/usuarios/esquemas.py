from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Lo que llega al registrarse (el rol no se recibe: siempre es "usuario")
class UsuarioRegistro(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    correo: EmailStr
    clave: str = Field(min_length=6)


# Lo que llega al iniciar sesión
class UsuarioLogin(BaseModel):
    correo: EmailStr
    clave: str


# Lo que se devuelve (nunca la clave)
class UsuarioRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    nombre: str
    correo: str
    rol: str
    activo: bool


# Respuesta del login
class TokenRespuesta(BaseModel):
    token: str
    usuario: UsuarioRespuesta