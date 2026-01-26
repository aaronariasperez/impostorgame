# Firebase Migration - Complete ✅

## Status: READY TO USE

Tu backend ha sido migrado exitosamente a Firebase. Los word packs y logs ahora viven en Firestore en lugar de archivos locales.

## ✅ Lo que se hizo

### 1. Instalación de Dependencias
- ✅ `firebase-admin` - SDK de Firebase
- ✅ `dotenv` - Manejo de variables de entorno

### 2. Nuevos Módulos
- ✅ `src/firebase/firebase.service.ts` - Servicio de inicialización
- ✅ `src/firebase/firebase.module.ts` - Módulo de Firebase

### 3. Servicios Actualizados
- ✅ `src/word-packs/word-packs.service.ts` - Lee de Firestore
- ✅ `src/telemetry/telemetry.service.ts` - Escribe en Firestore

### 4. Configuración
- ✅ `src/main.ts` - Carga variables de entorno con dotenv
- ✅ `.env.example` - Template de configuración
- ✅ `firebase-service-account.json` - Credenciales (en .gitignore)

### 5. Migración de Datos
- ✅ `scripts/migrate-to-firebase.ts` - Script de migración
- ✅ `npm run migrate:firebase` - Ejecutado exitosamente
  - 6 word packs migrados
  - 12 visit logs migrados
  - 22 event logs migrados

## 🚀 Cómo Usar

### 1. Verificar Configuración
```bash
# Asegúrate de que .env existe con:
cat .env
```

Debe contener:
```
FIREBASE_PROJECT_ID=impostor-16c49
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 2. Iniciar el Backend
```bash
npm run start:dev
```

Deberías ver:
```
🎮 Impostor backend running on http://localhost:3000
Loaded 6 word packs from Firebase
```

### 3. Verificar que Funciona
```bash
# Obtener lista de word packs
curl http://localhost:3000/api/word-packs

# Obtener un word pack específico
curl http://localhost:3000/api/word-packs/animales

# Enviar un evento de telemetría
curl -X POST http://localhost:3000/api/telemetry/event \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","eventType":"game_start","data":{"packId":"animales"}}'
```

## 📊 Estructura en Firestore

### Colección: `word_packs`
```
animales (doc)
├── name: "Animales"
├── description: "Palabras relacionadas con animales"
├── language: "es"
└── wordItems: [
    { word: "gato", attributes: ["felino", "doméstico"] },
    ...
  ]

ciencias-naturales (doc)
├── name: "Ciencias Naturales"
├── ...
```

### Colección: `telemetry_visits`
```
auto-generated-id (doc)
├── ts: "2024-01-15T10:30:00.000Z"
├── type: "visit"
├── sessionId: "session-123"
├── path: "/game"
├── referrer: null
├── userAgent: "Mozilla/5.0..."
└── timestamp: 1705318200000
```

### Colección: `telemetry_events`
```
auto-generated-id (doc)
├── ts: "2024-01-15T10:30:15.000Z"
├── type: "game_start"
├── sessionId: "session-123"
└── eventData: { packId: "animales", difficulty: "medium" }
```

## 🔒 Seguridad

### Firestore Security Rules
Las reglas están configuradas para:
- ✅ Permitir lectura de `word_packs` desde cualquier lugar
- ✅ Permitir escritura en `telemetry_visits` desde cualquier lugar
- ✅ Permitir escritura en `telemetry_events` desde cualquier lugar

Si necesitas restringir por IP o autenticación, actualiza las reglas en Firebase Console.

## 📁 Archivos Locales

Los siguientes archivos ya no se usan pero se pueden mantener como backup:
- `word_packs/*.json` - Definiciones de word packs
- `logs/telemetry-visits.jsonl` - Logs de visitas
- `logs/telemetry-events.jsonl` - Logs de eventos

Puedes eliminarlos cuando confirmes que todo funciona en Firebase.

## 🔄 Re-migración

Si necesitas migrar datos nuevamente:
```bash
npm run migrate:firebase
```

Esto sobrescribirá los datos en Firestore con los archivos locales.

## 🐛 Troubleshooting

### Error: "Service account object must contain a string 'project_id' property"
- Verifica que `.env` existe
- Verifica que `FIREBASE_SERVICE_ACCOUNT` apunta al archivo correcto
- Verifica que `firebase-service-account.json` existe y es válido

### Error: "Word packs not loading"
- Verifica que la colección `word_packs` existe en Firestore
- Verifica que los documentos tienen la estructura correcta
- Ejecuta `npm run migrate:firebase` para repoblar

### Error: "Telemetry not saving"
- Verifica las Firestore Security Rules
- Verifica que las colecciones `telemetry_visits` y `telemetry_events` existen
- Revisa la consola del navegador para errores de CORS

## 📝 Notas

- El backend es completamente agnóstico a si los datos vienen de archivos o Firebase
- Los endpoints de la API no cambiaron - es transparente para el frontend
- Los word packs se cachean en memoria al iniciar para mejor rendimiento
- Los logs se escriben directamente en Firestore sin cacheo

## ✨ Próximos Pasos

1. Prueba el backend con `npm run start:dev`
2. Verifica que el frontend sigue funcionando
3. Monitorea los logs en Firebase Console
4. Elimina los archivos locales cuando estés seguro

¡Listo para producción! 🚀
