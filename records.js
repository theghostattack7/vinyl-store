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
const tracks = new Map();

let currentAudio = null;
let currentButton = null;

buttons.forEach((button) => {
  const audioFile = button.dataset.audio;

  if (!audioFile) {
    console.error("Play button is missing data-audio:", button);
    return;
  }

  const audio = new Audio(audioFile);
  audio.preload = "none";

  tracks.set(button, audio);

  audio.addEventListener("error", () => {
    console.error("Could not load audio:", audioFile, audio.error);
  });
});

function stopCurrentTrack() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (currentButton) {
    currentButton.textContent = "▶";
  }

  currentAudio = null;
  currentButton = null;
}

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const audio = tracks.get(button);

    if (!audio) return;

    // Pause if the same track is already playing
    if (currentAudio === audio && !audio.paused) {
      audio.pause();
      button.textContent = "▶";
      return;
    }

    stopCurrentTrack();

    currentAudio = audio;
    currentButton = button;

    audio.currentTime = 0;
    button.textContent = "…";

    try {
      await audio.play();
      button.textContent = "■";
    } catch (error) {
      console.error("Playback failed:", error);
      button.textContent = "▶";
      currentAudio = null;
      currentButton = null;
    }
  });

  const audio = tracks.get(button);

  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= 25) {
        stopCurrentTrack();
      }
    });

    audio.addEventListener("ended", () => {
      if (currentAudio === audio) {
        stopCurrentTrack();
      }
    });
  }
});
