document.addEventListener('DOMContentLoaded', () => {
  const openFileDialog = window.electron.openFileDialog;

  let audio;
  const audiobookUrlElement = document.querySelector('#audiobookUrl');
  const progressElement = document.querySelector('#progress');
  const seekBar = document.querySelector('#seekBar');
  const chooseButton = document.querySelector('#chooseBtn');
  const playButton = document.querySelector('#playBtn');
  const pauseButton = document.querySelector('#pauseBtn');
  const stopButton = document.querySelector('#stopBtn');
  const lastPlayedList = document.querySelector('#lastPlayedList');
  const clearButton = document.querySelector('#clearBtn');
  const toggleSidebarBtn = document.querySelector('#toggleSidebarBtn');
  const sidebarContainer = document.querySelector('#sidebarContainer');
  const dragElement = document.querySelector('#dragRegion');
  const sidebar = document.querySelector('#sidebar');

  const lastTimestamp = localStorage.getItem('audioLastTimestamp');
  if (lastTimestamp) {
    progressElement.textContent = `Last played at: ${new Date(parseInt(lastTimestamp)).toLocaleString()}`;
  }

  let sidebarOpen = false;

  async function populateLastPlayedList() {
    const lastPlayedAudiobooks = JSON.parse(localStorage.getItem('lastPlayedAudiobooks')) || [];
  
    lastPlayedList.innerHTML = '';
  
    lastPlayedAudiobooks.forEach((audiobook) => {
      const listItem = document.createElement('li');
      const audiobookNameWithExtension = `${audiobook.name}`;
      listItem.textContent = audiobookNameWithExtension;
      listItem.classList.add('last-played-item');
      listItem.addEventListener('click', () => loadAudiobook(audiobook.url, audiobook.name));
      lastPlayedList.appendChild(listItem);
    });
  }

  chooseButton.addEventListener('click', async () => {
    try {
      const audiobookPath = await openFileDialog();
      console.log('Opened file dialog');
      console.log('Received audiobookPath:', audiobookPath);
      
      if (audiobookPath) {
        const audiobookName = getAudiobookNameFromPath(audiobookPath);
        console.log('Extracted audiobookName:', audiobookName);
  
        audiobookUrlElement.textContent = `Now playing: ${audiobookName}`;
  
        if (isValidUrl(audiobookPath)) {
          loadAudiobook(audiobookPath, audiobookName);
        } else {
          console.error('Invalid audiobook URL.');
        }
      }
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  });

  function loadAudiobook(url, audiobookName) {
    console.log('Loading audiobook:', url);
    audio = new Audio(url);
    audiobookUrlElement.textContent = `Now playing: ${audiobookName}`;

    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;

      seekBar.value = (currentTime / duration) * 100;

      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const totalMinutes = Math.floor(duration / 60);
      const totalSeconds = Math.floor(duration % 60);
      progressElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    });

    updateLastPlayedList(audiobookName, url);
  }

  function getAudiobookNameFromPath(audiobookPath) {
    const pathParts = audiobookPath.split('/');
    const audiobookFilename = pathParts.pop();
    const filenameParts = audiobookFilename.split('.');
    filenameParts.pop();
    const audiobookName = filenameParts.join('.');
    return audiobookName;
  }

  playButton.addEventListener('click', () => {
    if (audio) {
      audio.play();
    }
  });

  pauseButton.addEventListener('click', () => {
    if (audio) {
      audio.pause();
      localStorage.setItem('audioLastTimestamp', Date.now());
    }
  });

  stopButton.addEventListener('click', () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      localStorage.removeItem('audioLastTimestamp');
      progressElement.textContent = '';
    }
  });

  clearButton.addEventListener('click', () => {
    localStorage.removeItem('lastPlayedAudiobooks');
    populateLastPlayedList();
  });

  function updateLastPlayedList(audiobookName, audiobookUrl) {
    const lastPlayedAudiobooks = JSON.parse(localStorage.getItem('lastPlayedAudiobooks')) || [];
    const audiobook = { name: audiobookName, url: audiobookUrl };
    lastPlayedAudiobooks.push(audiobook);
    localStorage.setItem('lastPlayedAudiobooks', JSON.stringify(lastPlayedAudiobooks));
    populateLastPlayedList();
  }

  toggleSidebarBtn.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    sidebarContainer.style.left = sidebarOpen ? '0' : '-300px';
  });

  dragElement.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const window = remote.getCurrentWindow();
    const { screenY } = e;

    const move = (e) => {
      const deltaY = screenY - e.screenY;
      const newY = window.getBounds().y - deltaY;
      window.setBounds({ y: newY });
    };

    const stop = () => {
      window.webContents.removeListener('mousemove', move);
      window.webContents.removeListener('mouseup', stop);
    };

    window.webContents.on('mousemove', move);
    window.webContents.on('mouseup', stop);
  });

  seekBar.addEventListener('input', () => {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  function isValidUrl(url) {
    return true;
  }
});