# PMO-App Frontend

Este directorio contiene el código fuente del frontend de la aplicación, desarrollado con React.

## Scripts

- `npm start` : Inicia la aplicación en modo desarrollo (en `http://localhost:3000`).
- `npm run build` : Construye la aplicación para producción.

## Estructura

- `src/index.js` : Punto de entrada de la aplicación React.
- `src/App.js` : Configura las rutas y el layout principal.
- `src/components/` : Componentes de la aplicación.
- `src/services/` : Funciones para comunicar el frontend con el backend (Axios).

## Configuración
- Asegúrate de que el backend esté corriendo en `http://localhost:4000` (o el puerto que definas).
- Modifica `src/services/*.js` si el backend se encuentra en otra URL.