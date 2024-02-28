import Sound from "../../src/sound.js";

var STATE = {
  ready: false,
};

const createNoteGroups = (initialOctave = 3, finalOctave = 6) => {
  const container = document.getElementById("note");
  if (!container) throw new Error(`Container with id note not found`);

  for (let octave = initialOctave; octave <= finalOctave; octave++) {
    const group = document.createElement("div");
    group.className = "grid";
    container.appendChild(group);

    group.innerHTML += `<button type="button" class="secondary" disabled> ${octave}</button>`;

    Object.keys(Sound.NOTES).forEach((note) => {
      group.innerHTML += `<button type="button" id="${note}_${octave}" class="outline">${note}</button>`;
    });
  }
};
const linkButtonGroup = (
  buttonGroupId,
  handler = () => {},
  action = "click"
) => {
  const group = document.getElementById(buttonGroupId);

  const firstButton = group.querySelector("button:not([disabled])");
  firstButton.classList.remove("outline");
  STATE[buttonGroupId] = firstButton.id;
  handler(firstButton.id);

  group.addEventListener(action, (e) => {
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
createNoteGroups();
linkButtonGroup(
  "note",
  (noteId) => {
    const [note, octave] = noteId.split("_");
    const frequency = Sound.noteToFrequency(note, Number(octave));
    STATE.frequency = frequency;
  },
  "mouseover"
);

STATE.ready = true;

function playSound() {
  const frequency = STATE.frequency;

  const sound = Sound.fromFrequency(frequency);

  sound.play();
}
