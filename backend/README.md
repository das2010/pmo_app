# PMO-App Backend

Este directorio contiene el código fuente del backend de la aplicación, basado en Node.js/Express y PostgreSQL.

## Scripts

- `npm run start` : Inicia el servidor en modo producción.
- `npm run dev` : Inicia el servidor en modo desarrollo (con Nodemon).

## Estructura

- `src/config/db.js` : Configuración y conexión a la base de datos PostgreSQL.
- `src/models/*.js` : Modelos para interactuar con las tablas.
- `src/controllers/*.js` : Lógica de negocio (CRUD) para cada entidad.
- `src/routes/*.js` : Rutas para los endpoints (REST) de cada entidad.
- `src/app.js` : Configuración principal de Express.

## Configuración de entorno

Crea un archivo `.env` en la carpeta raíz de `backend` con los siguientes valores (ajústalos a tu entorno):

