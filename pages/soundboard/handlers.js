import Sound from "../../src/sound.js";
import Chord from "../../src/chord.js";

var STATE = {
  ready: false,
};

function linkSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  const label = document.querySelector(`label[for=${sliderId}]`);

  label.innerHTML = slider.value;
  STATE[sliderId] = Number(slider.value);

  slider.addEventListener("input", () => {
    label.innerHTML = slider.value;
    STATE[sliderId] = Number(slider.value);
    STATE.ready && playSound();
  });
}
["duration", "volume", "shift"].forEach((sliderId) => linkSlider(sliderId));

const linkButtonGroup = (buttonGroupId, handler = () => {}) => {
  const group = document.getElementById(buttonGroupId);

  const firstButton = group.querySelector("button:not([disabled])");
  firstButton.classList.remove("outline");
  STATE[buttonGroupId] = firstButton.id;
  handler(firstButton.id);

  group.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const button = e.target;

      const prevId = STATE[buttonGroupId].replace("#", "\\#");
      const prevSelector = `#${buttonGroupId} #${prevId}`;
      const previousButton = document.querySelector(prevSelector);
      if (previousButton) previousButton.classList.add("outline");

      button.classList.remove("outline");
      STATE[buttonGroupId] = button.id;
      handler(button.id);
      STATE.ready && playSound();
    }
  });
};
linkButtonGroup("osc-type", (oscType) => {
  STATE["osc-type"] = oscType;
});
linkButtonGroup("note", (noteId) => {
  const [note, octave] = noteId.split("_");
  const frequency = Sound.noteToFrequency(note, Number(octave));
  STATE.frequency = frequency;
});
linkButtonGroup("fade", (fadeType) => {
  STATE["fade"] = fadeType;
});
linkButtonGroup("chord", (chordType) => {
  STATE["chord"] = chordType;
});
linkButtonGroup("harmonics", (harmonicsType) => {
  STATE["harmonics"] = harmonicsType;
});

STATE.ready = true;

function playSound() {
  const sound_config = {
    frequency: STATE.frequency,
    duration: STATE.duration,
    volume: STATE.volume,
    oscillatorType: Sound.OSC_TYPES[STATE["osc-type"]],
    fade: Sound.FADE_TYPES[STATE["fade"]],
    shift: STATE.shift,
  };
  const chord_notes = Chord.TYPES[STATE["chord"]];
  const harmonics = Chord.HARMONICS[STATE["harmonics"]];

  const chord = Chord.fromSound(sound_config, chord_notes, harmonics);
  chord.play();
}
