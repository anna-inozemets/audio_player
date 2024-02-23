const playerTrackList = document.querySelectorAll('.player-playlist li');
const timerElement = document.querySelector('.timer');
const titleElement = document.querySelector('.title');
const durationElement = document.querySelector('.duration');
const playButton = document.querySelector('.button-play');
const volumeInput = document.getElementById('volume');
const prevButton = document.querySelector('.button-prev');
const nextButton = document.querySelector('.button-next');

let sound;
let currentTrackIndex = 0;

function playTrack(trackItem) {
  const currentSrc = trackItem.getAttribute('data-src');

  if (sound && sound.playing()) {
    sound.stop();
  }

  sound = new Howl({
    src: [currentSrc],
    volume: 0.5,
    loop: false,
    onend: function () {
      timerElement.textContent = '00:00';
      playButton.innerHTML = '<i class="fa-solid fa-play fa-2xl" style="color: #4B2F94;"></i>';
      playNextTrack();
    },
    onload: function () {
      titleElement.textContent = trackItem.querySelector('span').textContent;

      const duration = formatTime(sound.duration());
      durationElement.textContent = duration;

      sound.on('play', () => {
        setInterval(() => {
          timerElement.textContent = formatTime(sound.seek());
        }, 1000);
      });

      playButton.innerHTML = '<i class="fa-solid fa-pause fa-xl" style="color: #4B2F94;"></i>';
    },
  });

  sound.play();
}

function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playerTrackList.length;
  playTrack(playerTrackList[currentTrackIndex]);
}

function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playerTrackList.length) % playerTrackList.length;
  playTrack(playerTrackList[currentTrackIndex]);
}

function playFirstTrack() {
  currentTrackIndex = 0;
  playTrack(playerTrackList[currentTrackIndex]);
}

playerTrackList.forEach((trackItem, index) => {
  trackItem.addEventListener('click', () => {
    currentTrackIndex = index;
    playTrack(trackItem);
  });
});

playButton.addEventListener('click', () => {
  if (!sound) {
    playFirstTrack();
  } else if (sound.playing()) {
    sound.pause();
    playButton.innerHTML = '<i class="fa-solid fa-play fa-xl" style="color: #4B2F94;"></i>';
  } else {
    sound.play();
    playButton.innerHTML = '<i class="fa-solid fa-pause fa-xl" style="color: #4B2F94;"></i>';
  }
});

prevButton.addEventListener('click', () => {
  playPrevTrack();
});

nextButton.addEventListener('click', () => {
  playNextTrack();
});

function setVolume() {
  const volume = volumeInput.value;
  if (sound) {
    sound.volume(volume);
  }
}

volumeInput.addEventListener('input', setVolume);

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
