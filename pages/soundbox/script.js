import Sound from "../../src/sound.js";
import Chord from "../../src/chord.js";

const setSelectOptions = (selectId, optionMap, groupIfString = false) => {
  const select = document.getElementById(selectId);
  let optgroup = select;

  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  Object.keys(optionMap).forEach((key) => {
    if (groupIfString && typeof optionMap[key] === "string") {
      optgroup = document.createElement("optgroup");
      optgroup.label = optionMap[key];
      select.appendChild(optgroup);
    } else {
      const option = document.createElement("option");
      option.value = key;
      option.text = key;
      optgroup.appendChild(option);
    }
  });
};

setSelectOptions("osc-type", Sound.OSC_TYPES);
setSelectOptions("note", Sound.NOTES);
setSelectOptions("fade", Sound.FADE_TYPES);
setSelectOptions("chord", Chord._TYPES, true);
setSelectOptions("harmonics", Chord._HARMONICS, true);

const getConfig = () => {
  const oscillatorTypeKey = document.getElementById("osc-type").value;
  const oscillatorType = Sound.OSC_TYPES[oscillatorTypeKey];

  const note = document.getElementById("note").value;
  const octave = Number(document.getElementById("octave").value);
  const frequency = Sound.noteToFrequency(note, octave);

  const duration = Number(document.getElementById("duration").value);
  const volume = Number(document.getElementById("volume").value);
  const fade_type = document.getElementById("fade").value;
  const fade = Sound.FADE_TYPES[fade_type];

  const chord_type = document.getElementById("chord").value;
  const chord_notes = Chord.TYPES[chord_type];

  const harmonics_type = document.getElementById("harmonics").value;
  const harmonics = Chord.HARMONICS[harmonics_type];

  const shift = Number(document.getElementById("shift").value);

  return {
    frequency,
    duration,
    volume,
    oscillatorType,
    fade,
    chord_notes,
    harmonics,
    shift,
  };
};

const playNote = () => {
  const config = getConfig();
  Sound.fromConfig(config).play();
};

const playChord = () => {
  const config = getConfig();
  const chord_notes = config.chord_notes;
  const harmonics = config.harmonics;
  Chord.fromSound(config, chord_notes, harmonics).play();
};

document.getElementById("playNote").addEventListener("click", playNote);

document.getElementById("playChord").addEventListener("click", playChord);
