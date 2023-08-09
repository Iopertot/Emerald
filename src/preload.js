const { contextBridge, ipcRenderer, openFileDialog } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  openFileDialog: async () => {
    try {
      const audiobookPath = await ipcRenderer.invoke('open-file-dialog');
      console.log('Received audiobookPath:', audiobookPath);
      return audiobookPath;
    } catch (error) {
      console.error('Error opening file dialog:', error);
      return null;
    }
  }
});