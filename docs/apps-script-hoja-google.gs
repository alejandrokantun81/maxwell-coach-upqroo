// Maxwell Coach · registro grupal en Google Sheets
// 1. Crea una hoja de cálculo nueva en Google Sheets.
// 2. Extensiones > Apps Script. Pega este código y cambia el PIN.
// 3. Implementar > Nueva implementación > Aplicación web.
//    Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
// 4. Copia la URL que termina en /exec y pégala en el ajuste "sheetsUrl" de Maxwell Coach.
//    El PIN debe ser el mismo que "facilitatorPin" en la app.
// Si actualizas este código: Implementar > Administrar implementaciones > Editar (lápiz)
//    > Versión: Nueva versión > Implementar. Así la URL /exec no cambia.

const PIN = '2026';
const CAMPOS = ['id', 'ts', 'group', 'top', 'bottom', 'rojo', 'azul', 'amarillo', 'verde', 'answered', 'secs', 'timedOut'];
const TITULOS = ['id', 'fecha', 'grupo', 'estilo_alto', 'estilo_bajo', 'rojo', 'azul', 'amarillo', 'verde', 'respondidas', 'segundos', 'tiempo_agotado'];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Sesiones');
  if (!sh) {
    sh = ss.insertSheet('Sesiones');
    sh.appendRow(TITULOS);
    sh.getRange(1, 1, sh.getMaxRows(), 1).setNumberFormat('@');
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  const r = JSON.parse(e.postData.contents);
  if (r.action === 'borrar') return ContentService.createTextOutput(JSON.stringify(borrar_(hoja_(), r.pin, r.group)));
  if (!r.id || !r.top) return ContentService.createTextOutput('ignorado');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = hoja_();
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(f => String(f[0])) : [];
    if (ids.indexOf(String(r.id)) === -1) sh.appendRow(CAMPOS.map(c => r[c]));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

// Borra las filas de un grupo, o todas si el grupo es "TODOS". Requiere el PIN.
// También quita filas incompletas (sin id o sin estilo), que no son sesiones válidas.
function borrar_(sh, pin, grupo) {
  if (String(pin) !== PIN) return { ok: false, error: 'pin' };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const n = sh.getLastRow() - 1;
    if (n <= 0) return { ok: true, borradas: 0 };
    const filas = sh.getRange(2, 1, n, CAMPOS.length).getValues();
    const valida = f => String(f[0]) !== '' && String(f[3]) !== '';
    const quedan = grupo === 'TODOS' ? [] : filas.filter(f => valida(f) && String(f[2]) !== String(grupo));
    sh.getRange(2, 1, n, CAMPOS.length).clearContent();
    if (quedan.length) sh.getRange(2, 1, quedan.length, CAMPOS.length).setValues(quedan);
    return { ok: true, borradas: n - quedan.length };
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e.parameter.borrar) {
    return ContentService.createTextOutput(JSON.stringify(borrar_(hoja_(), e.parameter.pin, e.parameter.borrar))).setMimeType(ContentService.MimeType.JSON);
  }
  const salida = [];
  if (e.parameter.pin === PIN) {
    const sh = hoja_();
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      sh.getRange(2, 1, n, CAMPOS.length).getValues().forEach(f => {
        const o = {};
        CAMPOS.forEach((c, i) => { o[c] = f[i] instanceof Date ? f[i].toISOString() : f[i]; });
        salida.push(o);
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify(salida)).setMimeType(ContentService.MimeType.JSON);
}
