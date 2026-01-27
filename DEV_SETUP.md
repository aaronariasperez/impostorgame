# Development Setup - Impostor Game

## Requisitos Previos

- Node.js 18+ instalado
- Firebase project configurado
- `firebase-service-account.json` en `backend/`
- `backend/.env` configurado

## Opción 1: Script Automático (Recomendado)

### En Linux/Mac
```bash
./start-dev.sh
```

### En Windows
```bash
start-dev.bat
```

Esto iniciará automáticamente:
- ✅ Backend en `http://localhost:3000`
- ✅ Frontend en `http://localhost:5173`

Presiona `Ctrl+C` para detener ambos servidores.

## Opción 2: Terminales Separadas

### Terminal 1 - Backend
```bash
cd backend
npm install  # Solo la primera vez
npm run start:dev
```

Deberías ver:
```
🎮 Impostor backend running on http://localhost:3000
Loaded 6 word packs from Firebase
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

Deberías ver:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:5173/
```

## Verificar que Funciona

### 1. Abre el navegador
```
http://localhost:5173
```

### 2. Verifica que el frontend carga
- Deberías ver la página del juego
- No debe haber errores en la consola del navegador

### 3. Verifica que el backend responde
```bash
curl http://localhost:3000/api/word-packs
```

Deberías obtener una lista de word packs en JSON.

### 4. Verifica que Firebase funciona
- Abre Firebase Console
- Ve a Firestore Database
- Deberías ver las colecciones:
  - `word_packs` (6 documentos)
  - `telemetry_visits` (logs de visitas)
  - `telemetry_events` (logs de eventos)

## Troubleshooting

### Error: "backend/.env not found"
```bash
# Crea el archivo .env
cd backend
cp .env.example .env
# Edita .env con tus credenciales de Firebase
```

### Error: "firebase-service-account.json not found"
```bash
# Descarga el archivo desde Firebase Console
# Project Settings → Service Accounts → Generate New Private Key
# Guárdalo como backend/firebase-service-account.json
```

### Error: "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install
```

### Error: "Cannot find module 'react'"
```bash
cd frontend
npm install
```

### Backend no carga word packs
```bash
# Verifica que Firestore tiene datos
# Si no, ejecuta la migración:
cd backend
npm run migrate:firebase
```

### Frontend no se conecta al backend
- Verifica que el backend está corriendo en puerto 3000
- Verifica CORS en `backend/src/main.ts`
- Abre la consola del navegador (F12) para ver errores

## Desarrollo

### Cambios en el Backend
- Los cambios se recargan automáticamente con `npm run start:dev`
- Si hay errores de compilación, verás el error en la terminal

### Cambios en el Frontend
- Los cambios se recargan automáticamente en el navegador
- Si hay errores, verás el error en la consola del navegador

## Parar los Servidores

### Con Script Automático
Presiona `Ctrl+C` en la terminal principal

### Con Terminales Separadas
Presiona `Ctrl+C` en cada terminal

## Próximos Pasos

1. ✅ Verifica que ambos servidores corren
2. ✅ Abre http://localhost:5173 en el navegador
3. ✅ Juega una partida para probar
4. ✅ Abre Firebase Console para ver los logs

¡Listo para desarrollar! 🚀
