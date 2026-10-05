/**
 * Обратная связь с сайта-резюме.
 * Каждая заявка из формы на странице «Контакты» ложится строкой в эту
 * Google Таблицу и приходит письмом на NOTIFY_EMAIL. «Ответить» в письме
 * сразу пишет автору заявки.
 *
 * Подключение (один раз):
 * 1. Откройте https://sheets.new и назовите таблицу, например «Заявки с сайта».
 * 2. Расширения → Apps Script. Удалите всё в Code.gs, вставьте этот файл, сохраните.
 * 3. Начать развертывание → Новое развертывание → «Веб-приложение».
 *    Запуск от имени: «Я». Доступ: «Все». Нажмите «Развернуть».
 * 4. Google один раз спросит доступ к таблице и почте: разрешите.
 * 5. Скопируйте URL веб-приложения (заканчивается на /exec) и вставьте его
 *    в FORM_ENDPOINT в index.src.html, затем пересоберите сайт.
 *
 * После правок этого файла: Развертывание → Управление развертываниями →
 * карандаш → Версия «Новая версия». URL при этом не меняется.
 */

const NOTIFY_EMAIL = 'ivanmorozov112233@gmail.com';
// The sheet is opened by id, so the script works whether or not it is bound to the spreadsheet.
const SPREADSHEET_ID = '1DuUJ9dTY9r5xMH7iJQeORlI-tLp1v20nCtiJCh7KRZs';
const SHEET_NAME = 'Заявки';
const HEADERS = ['Дата', 'Имя', 'Почта', 'Компания', 'Тема', 'Сообщение', 'Страница'];
const LIMITS = { name: 120, email: 160, company: 160, topic: 60, message: 800, page: 300 };

function doPost(e) {
  // An uncaught error returns Google's HTML error page without CORS headers,
  // which the site cannot read; report every failure as JSON instead.
  try {
    return handle_(e);
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function handle_(e) {
  const p = (e && e.parameter) || {};
  // Honeypot: people never see the "website" field, bots fill it in.
  if (p.website) return json_({ ok: true });

  const d = {};
  Object.keys(LIMITS).forEach(function (k) { d[k] = String(p[k] || '').trim().slice(0, LIMITS[k]); });
  if (d.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || d.message.length < 20) {
    return json_({ ok: false, error: 'invalid' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date()].concat([d.name, d.email, d.company, d.topic, d.message, d.page].map(safe_)));
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: d.email,
    name: 'Сайт-резюме',
    subject: 'Новая заявка с сайта: ' + d.name + (d.topic ? ' · ' + d.topic : ''),
    body: [
      'Имя: ' + d.name,
      'Почта: ' + d.email,
      'Компания: ' + (d.company || 'не указана'),
      'Тема: ' + (d.topic || 'не указана'),
      '',
      d.message,
      '',
      'Страница: ' + d.page,
      'Все заявки: ' + spreadsheet_().getUrl(),
    ].join('\n'),
  });

  return json_({ ok: true });
}

// Opening the /exec URL in a browser is a quick check that the deployment works.
function doGet() {
  return ContentService.createTextOutput('Форма обратной связи работает.');
}

function spreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function sheet_() {
  const ss = spreadsheet_();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setColumnWidth(6, 420);
  }
  return sheet;
}

// A value starting with = + - @ would run as a formula in Sheets; store it as text.
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
