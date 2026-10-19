// Maxwell Coach · ajustes
// Edita estos valores y vuelve a publicar. No hace falta tocar app.js.
window.MAXWELL_CONFIG = {
  // URL de la aplicación web de Google Apps Script (termina en /exec).
  // Vacía: cada resultado se guarda solo en el navegador del participante.
  sheetsUrl: 'https://script.google.com/macros/s/AKfycbw88wJ8B8Ad_3fM_Lr2QR8C6H-Mhm78HMmHDCeSXaFhIhR9D-X_odnIbaNJtQab1I87/exec',
  // PIN del panel del facilitador. Debe coincidir con el PIN de apps-script-hoja-google.gs.
  facilitatorPin: '2026',
  // true: cada tarjeta del cuestionario usa el color de su afirmación.
  colorCards: false,
  // false: el tiempo sigue corriendo, pero no se muestra.
  showTimer: true,
  // Duración del cuestionario en segundos (4 minutos).
  timeLimit: 240
};
