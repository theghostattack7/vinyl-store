//RECORD SPIN//
let record = document.querySelector(".record-playing img");

let rotation = 0;
let spinning = false;

record.addEventListener("mouseenter", () => {
  spinning = true;
  spin();
});

record.addEventListener("mouseleave", () => {
  spinning = false;
});

function spin() {
  if (spinning === false) return;
  rotation += 2;
  record.style.transform = `rotate(${rotation}deg)`;

  requestAnimationFrame(spin);
}

//ALBUM COVER//
let albumCover = document.querySelector(".album-cover");

albumCover.addEventListener("click", () => {
  albumCover.classList.add("slide-away");
});

// AUDIO PLAYER //

const buttons = document.querySelectorAll(".play-button");

const tracks = {};

buttons.forEach((button) => {
  const audioFile = button.dataset.audio;

  const audio = new Audio();
  audio.preload = "auto";
  audio.src = audioFile;

  tracks[audioFile] = audio;
});

let currentAudio = null;
let currentButton = null;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const audioFile = button.dataset.audio;
    const audio = tracks[audioFile];

    // Clicking the same button pauses the song
    if (currentAudio === audio && !audio.paused) {
      audio.pause();
      button.textContent = "▶";
      return;
    }

    // Stop previous song
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (currentButton) {
      currentButton.textContent = "▶";
    }

    // Start selected song
    currentAudio = audio;
    currentButton = button;

    audio.currentTime = 0;
    audio.play();

    button.textContent = "■";
  });
});

// Stop after 25 seconds
Object.values(tracks).forEach((audio) => {
  audio.addEventListener("timeupdate", () => {
    if (audio.currentTime >= 25) {
      audio.pause();
      audio.currentTime = 0;

      if (currentButton) {
        currentButton.textContent = "▶";
      }

      currentAudio = null;
      currentButton = null;
    }
  });
});
