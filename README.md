# Maxwell Coach · Liderazgo académico (UP QROO)

Cuestionario tipo Tinder de 50 afirmaciones que identifica el estilo de liderazgo académico en 4 colores: **Rojo Directivo, Azul Analítico, Amarillo Innovador y Verde Empoderador**.

La app está en `docs/` y es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación). Funciona en celular y en computadora.

## Publicar en GitHub Pages

1. En el repo: **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/docs`, y guarda.
3. En uno o dos minutos la app queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`. Esa es la liga para los participantes.

## Ajustes (`docs/config.js`)

| Ajuste | Qué hace | Valor inicial |
|---|---|---|
| `sheetsUrl` | URL de la hoja de Google (termina en `/exec`). Vacía = cada resultado queda solo en el navegador del participante. | `''` |
| `facilitatorPin` | PIN del panel del facilitador. | `'2026'` |
| `colorCards` | Las tarjetas usan el color de cada afirmación. | `false` |
| `showTimer` | Muestra la cuenta regresiva. | `true` |
| `timeLimit` | Duración del cuestionario en segundos. | `240` |

Puedes editar `config.js` directamente en GitHub (ícono del lápiz); Pages se actualiza solo.

## Resultados del grupo en Google Sheets

1. Crea una hoja de cálculo en Google Sheets → **Extensiones → Apps Script**.
2. Pega el contenido de `docs/apps-script-hoja-google.gs` y cambia el PIN.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: Yo. Acceso: Cualquier persona.
4. Copia la URL que termina en `/exec` y pégala en `sheetsUrl` de `docs/config.js`. Usa el mismo PIN en `facilitatorPin`.

Cada sesión guarda una fila anónima: fecha, grupo, estilo más alto, estilo más bajo, los 4 porcentajes, afirmaciones respondidas, segundos y si se agotó el tiempo. El PIN de la app solo oculta el panel; la protección real de los datos es el PIN del script.

## Flujo

Inicio (nombre y código de grupo) → 3 tarjetas de instrucciones → cuenta 3‑2‑1 → cuestionario (deslizar, botones ✓/✕ o flechas ← →; pausa; 4 minutos) → pantalla de cierre → perfil con gráfica → página de cada estilo → **Descargar resultados en PDF** (estilo más alto y más bajo).

- **Puntaje:** una afirmación directa suma con "De acuerdo"; una negativa suma con "En desacuerdo". Cada estilo = puntos ÷ afirmaciones respondidas de ese estilo.
- **Orden:** intercalado R1, A1, Y1, G1, R2… para no agrupar colores.
- **Panel del facilitador:** enlace bajo "Comenzar". Promedio por estilo, conteo de estilo más alto y más bajo, últimas sesiones y descarga CSV.

## Probar en tu computadora

Abre `docs/index.html` en el navegador. Para probar el envío a Google Sheets, sírvelo con un servidor local, por ejemplo `npx serve docs`.

## Otros archivos

- `project/` y `chats/`: diseño original de Claude Design y sus conversaciones (`HANDOFF.md` describe el paquete).
