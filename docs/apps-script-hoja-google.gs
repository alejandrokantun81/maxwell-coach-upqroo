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
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const r = JSON.parse(e.postData.contents);
    const sh = hoja_();
    if (r.action === 'borrar') return borrar_(sh, r);
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(f => String(f[0])) : [];
    if (ids.indexOf(String(r.id)) === -1) sh.appendRow(CAMPOS.map(c => r[c]));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

// Borra las filas de un grupo, o todas si el grupo es "TODOS". Requiere el PIN.
function borrar_(sh, r) {
  if (String(r.pin) !== PIN) return ContentService.createTextOutput('pin');
  const n = sh.getLastRow() - 1;
  if (n > 0) {
    const filas = sh.getRange(2, 1, n, CAMPOS.length).getValues();
    const quedan = r.group === 'TODOS' ? [] : filas.filter(f => String(f[2]) !== String(r.group));
    sh.getRange(2, 1, n, CAMPOS.length).clearContent();
    if (quedan.length) sh.getRange(2, 1, quedan.length, CAMPOS.length).setValues(quedan);
  }
  return ContentService.createTextOutput('ok');
}

function doGet(e) {
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
