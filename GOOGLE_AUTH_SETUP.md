# Configuración de Autenticación con Google

Esta guía te ayudará a configurar la autenticación con Google en tu aplicación.

## 1. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala

## 2. Crear Credenciales OAuth 2.0

### Para Web:
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth client ID"
3. Selecciona "Web application"
4. Agrega las URLs autorizadas:
   - `https://auth.expo.io/@gdev-hook/abailar-11GJzS` (reemplaza con tu username y slug)
   - `exp://localhost:8081` (para desarrollo)
5. Copia el **Client ID** (este es tu `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`)

### Para iOS:
1. Crea otra credencial OAuth 2.0
2. Selecciona "iOS"
3. Ingresa tu **Bundle ID**: `com.gdevhook.abailar11GJzS`
4. Copia el **Client ID** (este es tu `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`)

### Para Android:
1. Crea otra credencial OAuth 2.0
2. Selecciona "Android"
3. Ingresa tu **Package name**: `com.gdevhook.abailar11GJzS`
4. Necesitarás el **SHA-1 certificate fingerprint**:
   - Para desarrollo: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Para producción: Usa el keystore de tu app
5. Copia el **Client ID** (este es tu `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`)

## 3. Configurar Firebase Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Habilita **Google** como método de autenticación
5. Ingresa el **Web client ID** (el mismo que `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`)
6. Guarda los cambios

## 4. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=tu-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=tu-android-client-id.apps.googleusercontent.com
```

## 5. Configurar app.json (Opcional)

Si necesitas configurar URLs de redirección personalizadas, puedes agregar esto a `app.json`:

```json
{
  "expo": {
    "scheme": "abailar-11gjzs",
    "ios": {
      "bundleIdentifier": "com.gdevhook.abailar11GJzS"
    },
    "android": {
      "package": "com.gdevhook.abailar11GJzS"
    }
  }
}
```

## 6. Reiniciar el Servidor

Después de configurar todo, reinicia el servidor de Expo:

```bash
npx expo start --clear
```

## Notas Importantes

- El **Web Client ID** debe ser el mismo que uses en Firebase Authentication
- Para desarrollo local, puedes usar solo el Web Client ID
- Para producción, necesitarás los Client IDs específicos de cada plataforma
- Asegúrate de que las URLs de redirección en Google Cloud Console coincidan con las de Expo

## Solución de Problemas

### ⚠️ Error: "Access blocked: authorization Error" o "This app doesn't comply with Google validation rules"

Este es el error más común. Sigue estos pasos:

#### Paso 1: Configurar la Pantalla de Consentimiento OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a **APIs & Services** > **OAuth consent screen**
3. Selecciona **External** (para desarrollo) o **Internal** (solo si usas Google Workspace)
4. Completa la información requerida:
   - **App name**: Nombre de tu aplicación
   - **User support email**: Tu email
   - **Developer contact information**: Tu email
5. En **Scopes**, agrega:
   - `openid`
   - `profile`
   - `email`
6. En **Test users** (si está en modo Testing):
   - Agrega los emails de los usuarios que quieres que prueben la app
   - **IMPORTANTE**: Solo estos usuarios podrán iniciar sesión mientras la app esté en modo Testing

#### Paso 2: Agregar Usuarios de Prueba (Modo Testing)

Si tu app está en modo **Testing**:
1. Ve a **OAuth consent screen**
2. En la sección **Test users**, haz clic en **+ ADD USERS**
3. Agrega el email de la cuenta de Google que quieres usar para probar
4. Guarda los cambios
5. **Espera unos minutos** para que los cambios se propaguen

#### Paso 3: Cambiar a Modo Producción (Opcional)

Si quieres que cualquier usuario pueda usar la app:
1. Ve a **OAuth consent screen**
2. Haz clic en **PUBLISH APP**
3. Completa el proceso de verificación de Google (puede tardar varios días)
4. Mientras tanto, usa el modo Testing con usuarios de prueba

#### Paso 4: Verificar URLs de Redirección

1. Ve a **APIs & Services** > **Credentials**
2. Edita tu **OAuth 2.0 Client ID** (Web application)
3. En **Authorized redirect URIs**, asegúrate de tener:
   ```
   https://auth.expo.io/@gdev-hook/abailar-11GJzS
   ```
   (Reemplaza `gdev-hook` y `abailar-11GJzS` con tus valores reales)
4. Guarda los cambios

### Error: "The OAuth client was not found"
- Verifica que los Client IDs en `.env` sean correctos
- Asegúrate de que las credenciales estén habilitadas en Google Cloud Console

### Error: "redirect_uri_mismatch"
- Verifica que las URLs de redirección en Google Cloud Console incluyan:
  - `https://auth.expo.io/@TU_USERNAME/TU_SLUG`
  - `exp://localhost:8081` (para desarrollo)
- El formato debe ser exacto, sin espacios adicionales

### La autenticación funciona en web pero no en móvil
- Asegúrate de tener los Client IDs específicos para iOS y Android
- Verifica que el Bundle ID y Package name coincidan con los de Google Cloud Console
- Para desarrollo, puedes usar solo el Web Client ID en todas las plataformas

### Notas Importantes sobre el Modo Testing

- **Solo los usuarios agregados en "Test users" pueden iniciar sesión**
- Si cambias de cuenta de Google, asegúrate de agregarla como usuario de prueba
- Los cambios en la pantalla de consentimiento pueden tardar unos minutos en aplicarse
- Para producción, necesitarás publicar la app y completar la verificación de Google

