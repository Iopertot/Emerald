document.addEventListener('DOMContentLoaded', () => {
    const openFileDialog = window.electron.openFileDialog;
    const playAudio = window.electron.playAudio; // Access the playAudio function from window.electron
  
    let audio;
    const audiobookUrlElement = document.querySelector('#audiobookUrl');
    const progressElement = document.querySelector('#progress');
  
    // Load the last played audiobook and timestamp from localStorage, if available
    const lastPlayedAudiobook = localStorage.getItem('lastPlayedAudiobook');
    if (lastPlayedAudiobook) {
      // Sanitize and display the audiobook title to prevent XSS attacks
      audiobookUrlElement.textContent = sanitizeHTML(lastPlayedAudiobook);
    }
  
    const playButton = document.querySelector('#playBtn');
    const pauseButton = document.querySelector('#pauseBtn');
    const stopButton = document.querySelector('#stopBtn');
    const chooseButton = document.querySelector('#chooseBtn');
  
    // Event listener for the "Choose Audiobook" button
    chooseButton.addEventListener('click', async () => {
      const audiobookUrl = await openFileDialog();
      if (audiobookUrl) {
        // Sanitize and display the audiobook URL to prevent XSS attacks
        audiobookUrlElement.textContent = sanitizeHTML(audiobookUrl);
        localStorage.setItem('lastPlayedAudiobook', audiobookUrl); // Save the last played audiobook URL
  
        // Load the audio file and set its timestamp when it's ready
        audio = new Audio(audiobookUrl);
        audio.addEventListener('loadedmetadata', () => {
          const lastTimestamp = parseFloat(localStorage.getItem('lastTimestamp'));
          if (!isNaN(lastTimestamp)) {
            audio.currentTime = lastTimestamp; // Set the audio playback to the last saved timestamp
          }
        });
      }
    });
  
    // Event listener for the "Play" button
    playButton.addEventListener('click', () => {
      const audiobookUrl = audiobookUrlElement.textContent;
      if (audiobookUrl && audio) {
        if (audio.paused) {
          audio.play()
            .then(() => console.log('Audio playback started.'))
            .catch((err) => console.error('Error playing audio:', err));
        }
      }
    });
  
    // Event listener for the "Pause" button
    pauseButton.addEventListener('click', () => {
      if (audio && !audio.paused) {
        audio.pause();
        saveTimestamp(); // Save the current timestamp when paused
      }
    });
  
    // Event listener for the "Stop" button
    stopButton.addEventListener('click', () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        saveTimestamp(); // Save the current timestamp when stopped
      }
    });
  
    // Function to save the current timestamp to localStorage
    function saveTimestamp() {
      if (audio) {
        localStorage.setItem('lastTimestamp', audio.currentTime);
      }
    }
  
    // Function to sanitize HTML content to prevent XSS attacks
    function sanitizeHTML(input) {
      const tempDiv = document.createElement('div');
      tempDiv.textContent = input;
      return tempDiv.innerHTML;
    }
  });