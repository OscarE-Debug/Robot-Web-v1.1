// *Variables audio context

let audioCtx;
let audioBuffer;
let source;
let analyzer;
let isPlaying = false;

// *DOM Elements

const audioButtons = document.querySelectorAll(".audio-button");
const canvas = document.querySelector(".frequency-display");
const audio = document.querySelector("#audio");
const overlay = document.querySelector(".overlay-selection-btns");
const initialSource = document.querySelector(".intro-btn").dataset.src;
const selectionButtons = document.querySelector(".selection-buttons");
const selectButtons = document.querySelector(".select-answer");

const selectButton0 = document.querySelector(".slct-0");
const selectButton1 = document.querySelector(".slct-1");
const selectButton2 = document.querySelector(".slct-2");
const selectButton3 = document.querySelector(".slct-3");
const selectButton4 = document.querySelector(".slct-4");

// !SPECIAL DOM ELEMENTS

const audio1 = "audio/preg1.mp3";
const audio2 = "audio/preg2.mp3";
const audio3 = "audio/preg3.mp3";
const audio4 = "audio/preg4.mp3";
const audio5 = "audio/preg5.mp3";

const audioPositive1 = "audio/positivo1.mp3";
const audioPositive2 = "audio/positivo2.mp3";
const audioPositive3 = "audio/positivo3.mp3";
const audioPositive4 = "audio/positivo4.mp3";
const audioPositive5 = "audio/positivo5.mp3";

const audioNegative1 = "audio/negativo1.mp3";
const audioNegative2 = "audio/negativo2.mp3";
const audioNegative3 = "audio/negativo3.mp3";
const audioNegative4 = "audio/negativo4.mp3";
const audioNegative5 = "audio/negativo5.mp3";

// *Audio Analyzer
const initAnalyzer = () => {
  const analyzer = audioCtx.createAnalyser();
  analyzer.fftSize = 2048;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvasCtx = canvas.getContext("2d");

  const draw = () => {
    requestAnimationFrame(draw);

    analyzer.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 255, 0)";

    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  };
  draw();
  return analyzer;
};

// *Init audio

const loadAudio = async (src) => {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
};

const playAudio = async (src) => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  if (!analyzer) {
    analyzer = initAnalyzer();
  }

  if (isPlaying) {
    stopAudio();
  }
  await loadAudio(src);

  source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyzer);
  analyzer.connect(audioCtx.destination);
  source.start(0);

  audio.src = src;

  isPlaying = true;

  if (initialSource === src) {
    source.addEventListener("ended", () => {
      setTimeout(function () {
        playAudio(audio1);
      }, 1000);
    });
  } else if (audio1 === src) {
    source.addEventListener("ended", () => {
      overlay.classList.add("active");
    });
  } else if (audioPositive1 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      setTimeout(function () {
        playAudio(audio2);
      }, 500);
    });
  } else if (audioNegative1 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      setTimeout(function () {
        playAudio(audio2);
      }, 500);
    });
  } else if (audio2 === src) {
    source.addEventListener("ended", () => {
      selectionButtons.classList.add("active");
      selectButton0.classList.remove("active");
      selectButton1.classList.add("active");
    });
  } else if (audioPositive2 === src) {
    selectButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio3);
    });
  } else if (audioNegative2 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio3);
    });
  } else if (audio3 === src) {
    source.addEventListener("ended", () => {
      selectionButtons.classList.add("active");
      selectButton1.classList.remove("active");
      selectButton2.classList.add("active");
    });
  } else if (audioPositive3 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio4);
    });
  } else if (audioNegative3 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio4);
    });
  } else if (audio4 === src) {
    source.addEventListener("ended", () => {
      selectButton2.classList.remove("active");
      selectButton3.classList.add("active");
      selectionButtons.classList.add("active");
    });
  } else if (audioPositive4 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio5);
    });
  } else if (audioNegative4 === src) {
    selectionButtons.classList.remove("active");
    source.addEventListener("ended", () => {
      playAudio(audio5);
    });
  } else if (audio5 === src) {
    source.addEventListener("ended", () => {
      selectButton3.classList.remove("active");
      selectButton4.classList.add("active");
      selectionButtons.classList.add("active");
    });
  }
};

// !Play / Pause button

const pauseAudio = () => {
  if (isPlaying) {
    source.stop(0);
    isPlaying = false;
  }
};

const stopAudio = () => {
  if (isPlaying) {
    source.stop(0);
    isPlaying = false;
  }
};

audioButtons.forEach((button) => {
  const src = button.dataset.src;
  button.addEventListener("click", () => {
    playAudio(src);
  });
});

// !ANOTHER SELECTION OF AUDIO BUTTONS

const positiveButton = document.querySelectorAll(".positive");
const negativeButton = document.querySelectorAll(".negative");

positiveButton.forEach((button) => {
  button.addEventListener("click", () => {
    selectionButtons.classList.add("removing-active");
    setTimeout(function () {
      selectionButtons.classList.remove("removing-active");
      selectionButtons.classList.remove("active");
    }, 500);
  });
});

negativeButton.forEach((button) => {
  button.addEventListener("click", () => {
    selectionButtons.classList.add("removing-active");
    setTimeout(function () {
      selectionButtons.classList.remove("removing-active");
      selectionButtons.classList.remove("active");
    }, 500);
  });
});
