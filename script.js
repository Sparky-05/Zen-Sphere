const intro = document.getElementById("intro");
const main = document.getElementById("main-content");
const confirmation = document.getElementById("confirmation");
const form = document.getElementById("booking-form");

const experienceSounds = {
  forest: "sounds/piano.mp3",
  ocean: "sounds/rain.mp3",
  space: "sounds/space.mp3",
  mountain: "sounds/mountain.mp3"
};

// 👇 Add this mapping to match audio names to spoken labels
const experienceLabels = {
  forest: "piano",
  ocean: "rain",
  space: "space",
  mountain: "mountain"
};

const audioPlayerSection = document.getElementById("audio-player-section");
const audioElement = document.getElementById("audio");
const timestampElement = document.getElementById("timestamp");

let audioTimer;

function speakText(text, callback = null) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 1;
  utter.rate = 0.95;
  utter.volume = 1;
  utter.lang = "en-US";

  const chooseVoice = () => {
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v =>
      v.name.includes("Female") ||
      v.name.includes("Google US English") ||
      v.name.includes("Microsoft Zira")
    );
    if (femaleVoice) utter.voice = femaleVoice;
    synth.speak(utter);
    if (callback) {
      utter.onend = callback;
    }
  };

  if (synth.getVoices().length === 0) {
    synth.addEventListener("voiceschanged", chooseVoice);
  } else {
    chooseVoice();
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    intro.style.display = "none";
    main.style.display = "block";

    // Female voice welcome
    speakText("Zen-Sphere. Step in. Breathe Deep. Leave stress behind.");
  }, 3000);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const experience = document.getElementById("experience").value;
  const audioSource = experienceSounds[experience];

  confirmation.textContent = `Thank you, ${name}! Your Zen-Sphere session has been booked. Starting demo session...`;

  // Show the audio player section
  audioPlayerSection.style.display = "block";

  // Set the audio source and start the playback
  audioElement.src = audioSource;

  // Play the audio
  audioElement.play();

  // 👇 Use updated label for speaking experience name
  const spokenExperience = experienceLabels[experience];
  speakText(`Welcome to your ${spokenExperience} experience. Please sit comfortably, close your eyes, and relax. Your session begins now.`);

  // Update timestamp every second
  audioElement.ontimeupdate = function () {
    const currentTime = formatTime(audioElement.currentTime);
    const duration = formatTime(audioElement.duration);
    timestampElement.textContent = `${currentTime} / ${duration}`;
  };

  // Stop the audio after 10 minutes
  audioTimer = setTimeout(() => {
    audioElement.pause();
    audioElement.currentTime = 0;
    timestampElement.textContent = "Session completed.";
  }, 10 * 60 * 1000); // 10 minutes in milliseconds
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
