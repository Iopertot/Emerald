module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: { 
        name: 'emerlad',
        iconUrl: 'file:///C:/Users/USER-PC/Documents/coding/emerald/Emerald/src/images/texas.ico',
        setupIcon: 'src/images/texas.ico',
        authors: 'lopertot',
        description: 'Audiobook App built with electron and html5 audio',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
