\# Reportemos



Aplicación para reportar residuos sólidos en la calle. El usuario crea el reporte con una foto y la dirección, y el administrador lo marca como recogido.



Hecho con Angular, TailwindCSS, FastAPI y MySQL.



\## Pasos para correr el proyecto de forma local



1\. Importar en MySQL el archivo de la base de datos que está en el repositorio.

2\. En la carpeta del backend, crear el entorno virtual e instalar las dependencias del `requirements.txt`.

3\. Copiar el archivo `.env.example`, renombrarlo a `.env` y poner el usuario y la clave de MySQL.

4\. Levantar la API con `uvicorn app.main:app --reload`. La documentación queda en http://localhost:8000/docs

5\. En la carpeta del frontend, instalar las dependencias con `npm install`.

6\. Levantar la app con `ng serve`. Queda en http://localhost:4200

7\. Para entrar como administrador, registrarse desde la app y cambiar el rol a `admin` en la tabla `usuarios`.

