const { app, BrowserWindow, dialog, ipcMain } = require('electron');

const path = require('path');
const url = require('url');

let mainWindow;

app.on('web-contents-created', (event, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self'"],
      },
    });
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInline',
    titleBarOverlay: true,
    width: 1000,
    height: 600,
    icon: path.join(__dirname, './images/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}


app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audiobooks', extensions: ['m4a'] }]
  });
  return result;
});