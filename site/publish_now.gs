/**
 * Кнопка «Опубликовать на сайт сейчас» для таблиц «Инвест-часы», «Банковский сектор» и других таблиц отраслей.
 * Без неё сайт всё равно обновится сам в течение 15 минут — это только чтобы не ждать.
 *
 * Установка: Расширения → Apps Script → вставить этот файл → Сохранить.
 * Настройки проекта → Свойства скрипта → добавить:
 *   GITHUB_REPO  = erikjane/ip-banks
 *   GITHUB_TOKEN = fine-grained токен GitHub с правом «Actions: Read and write» только на этот репозиторий
 * После перезагрузки таблицы появится меню «Сайт».
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Сайт')
    .addItem('Опубликовать на сайт сейчас', 'publishNow')
    .addToUi();
}

function publishNow() {
  const p = PropertiesService.getScriptProperties();
  const repo = p.getProperty('GITHUB_REPO'), token = p.getProperty('GITHUB_TOKEN');
  if (!repo || !token) {
    SpreadsheetApp.getUi().alert('Не заданы GITHUB_REPO и GITHUB_TOKEN в свойствах скрипта.');
    return;
  }
  const res = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + repo + '/actions/workflows/site.yml/dispatches', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
      payload: JSON.stringify({ ref: 'main' }),
      muteHttpExceptions: true
    });
  const ok = res.getResponseCode() === 204;
  SpreadsheetApp.getActive().toast(ok ? 'Готово: сайт обновится через 1–2 минуты.' : 'Ошибка GitHub: ' + res.getContentText(), 'Сайт', 6);
}
