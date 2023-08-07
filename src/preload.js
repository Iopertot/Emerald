const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  require: require,
  openFileDialog: async () => {
    const { filePaths } = await ipcRenderer.invoke('open-file-dialog');
    return filePaths && filePaths.length > 0 ? filePaths[0] : null;
  }
});