# 🎭 Impostor - El Juego

Un juego de deducción social donde los jugadores deben descubrir quién es el impostor (o descubrir la palabra si eres el impostor).

## 🎮 Características

- **Juego Local**: Todos los jugadores comparten un dispositivo
- **Múltiples Impostores**: Configurable según el número de jugadores
- **Paquetes de Palabras**: Diferentes categorías de palabras en español
- **Fases de Juego**: Pistas, Discusión, Votación, Resultados
- **Oportunidad del Impostor**: Si es eliminado, tiene una chance de adivinar la palabra civil
- **Interfaz Móvil**: Diseño responsive optimizado para móviles

## 🏗️ Arquitectura

### Backend (NestJS)
- Servicio de paquetes de palabras
- API REST simple
- CORS habilitado para desarrollo

### Frontend (React + Vite)
- Gestión de estado con Zustand
- Componentes por fase de juego
- Estilos con Tailwind CSS
- Lógica del juego completamente en el cliente

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🚀 Instalación

### Backend

```bash
cd backend
npm install
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🎯 Flujo del Juego

1. **Setup**: Selecciona número de jugadores, impostores y paquete de palabras
2. **Pistas**: Cada jugador da una pista sobre su palabra (4 minutos)
3. **Discusión**: Los jugadores discuten quién es el impostor (4 minutos)
4. **Votación**: Todos votan por quién creen que es el impostor
5. **Resultados**: Se revela el rol del jugador eliminado
6. **Oportunidad del Impostor** (si aplica): El impostor eliminado intenta adivinar la palabra civil
7. **Fin del Juego**: Cuando todos los impostores son eliminados o adivinan correctamente

## 📦 Paquetes de Palabras

Actualmente incluidos:
- **Animales**: Palabras relacionadas con animales
- **Frutas**: Palabras relacionadas con frutas
- **Profesiones**: Palabras relacionadas con profesiones

## 🔧 Desarrollo

### Estructura del Proyecto

```
impostor/
├── backend/
│   ├── src/
│   │   ├── word-packs/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 📝 Notas

- El juego está diseñado para ser jugado en un solo dispositivo
- Los jugadores pasan el teléfono para ver su palabra secreta
- No hay persistencia de datos entre sesiones
- La conexión a internet es necesaria para descargar los paquetes de palabras

## 🎨 Personalización

Para agregar nuevos paquetes de palabras, edita `backend/src/word-packs/word-packs.service.ts` y agrega un nuevo objeto a la lista `wordPacks`.

## 📄 Licencia

MIT
