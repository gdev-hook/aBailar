# Configuración de Firebase Authentication

Este proyecto está configurado con Firebase Authentication. Sigue estos pasos para configurarlo:

## 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** en el menú lateral
4. En Authentication, habilita el método de autenticación **Email/Password**

## 2. Obtener las credenciales de Firebase

1. En Firebase Console, ve a **Configuración del proyecto** (ícono de engranaje)
2. Desplázate hasta **Tus aplicaciones**
3. Si no tienes una app web, haz clic en **Agregar app** > **Web** (</>)
4. Copia los valores de configuración que se muestran

## 3. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

**Nota:** Todas las variables deben comenzar con `EXPO_PUBLIC_` para que Expo las exponga al código de la aplicación.

## 4. Reiniciar el servidor de desarrollo

Después de crear el archivo `.env`, reinicia el servidor de Expo:

```bash
npx expo start --clear
```

## Funcionalidades implementadas

- ✅ Inicio de sesión con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Cerrar sesión
- ✅ Protección de rutas (redirige a login si no estás autenticado)
- ✅ Estado de autenticación persistente
- ✅ Recuperación de contraseña (función disponible en el contexto)

## Uso

### Pantallas disponibles

- `/login` - Pantalla de inicio de sesión
- `/register` - Pantalla de registro
- `/(tabs)` - Pantallas protegidas (requieren autenticación)

### Usar el contexto de autenticación

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, logout } = useAuth();

  // user contiene el usuario actual o null
  // signIn, signUp, logout son funciones para manejar la autenticación
}
```

## Solución de problemas

### Error: "Firebase: Error (auth/invalid-api-key)"

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### La autenticación no persiste

- Esto es normal en Expo Go. Para persistencia completa, crea un development build:
  ```bash
  npm run development-builds
  ```
