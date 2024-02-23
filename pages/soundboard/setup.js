import Sound from "../../src/sound.js";
import Chord from "../../src/chord.js";

const createGroup = (containerId, groupArr) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container with id ${containerId} not found`);

  groupArr.forEach((key) => {
    container.innerHTML += `<button type="button" id="${key}" class="outline">${key}</button>`;
  });
};
createGroup("osc-type", Object.keys(Sound.OSC_TYPES));
createGroup("fade", Object.keys(Sound.FADE_TYPES));

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
createNoteGroups();

const createFolderGroups = (containerId, keys) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container with id ${containerId} not found`);

  let group = document.createElement("div");
  group.className = "grid";
  container.appendChild(group);

  keys.forEach((type) => {
    if (type.startsWith("_")) {
      group = document.createElement("div");
      group.className = "grid";
      container.appendChild(group);
      group.innerHTML += `<button type="button" class="secondary" disabled> ${type.slice(
        1
      )}</button>`;
    } else {
      group.innerHTML += `<button type="button" id="${type}" class="outline">${type}</button>`;
    }
  });
};
createFolderGroups("chord", Object.keys(Chord._TYPES));
createFolderGroups("harmonics", Object.keys(Chord._HARMONICS));
