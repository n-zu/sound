import Sound from "../sound/sound.js";

const setSelectOptions = (selectId, optionMap) => {
  const select = document.getElementById(selectId);

  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  Object.keys(optionMap).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.text = key;
    select.appendChild(option);
  });
};

setSelectOptions("osc-type", Sound.OSC_TYPES);
setSelectOptions("note", Sound.NOTES);
setSelectOptions("fade", Sound.FADE_TYPES);

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

  return { oscillatorType, frequency, duration, volume, fade };
};

const playSound = () => {
  const config = getConfig();
  Sound.fromConfig(config).play();
};

document.getElementById("playButton").addEventListener("click", playSound);
