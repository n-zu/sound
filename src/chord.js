import Sound from "./sound.js";

class Chord {
  static _TYPES = {
    _MAJOR: "MAJOR",
    MAJOR: [0, 4, 7],
    SEVENTH: [0, 4, 7, 10],

    _MINOR: "MINOR",
    MINOR: [0, 3, 7],
    MINOR_SEVENTH: [0, 3, 7, 10],

    _SPECIAL: "SPECIAL",
    AUGMENTED: [0, 4, 8],
    DIMINISHED: [0, 3, 6],
    SUSPENDED: [0, 5, 7],

    _SHORT: "SHORT",
    POWER: [0, 7],
    UP: [0, 3],
    DOWN: [0, 4],

    _CUSTOM: "CUSTOM",
    COMPACT: [0, 1, 2],
    FIBONACCI_5: [1, 2, 3, 5, 8],
    MOST: [0, 4, 7, 9 - 12],
    LEAST: [0, 3, 7, 12 - 12],
  };

  static TYPES = Object.keys(Chord._TYPES).reduce((acc, key) => {
    if (!key.startsWith("_")) acc[key] = Chord._TYPES[key];
    return acc;
  }, {});

  static DEFAULT_TYPE = Chord.TYPES.MAJOR;
  static DEFAULT_FREQUENCY = 440;

  constructor(type = Chord.DEFAULT_TYPE, sound_config) {
    const frequency = sound_config.frequency ?? Chord.DEFAULT_FREQUENCY;
    const shift = sound_config.shift ?? 0;

    let frequencies = type.map(
      (interval) => frequency * Math.pow(2, (interval + shift) / 12)
    );

    shiftFrequencies(frequencies, shift);

    this.sounds = frequencies.map((f) => Sound.fromFrequency(f, sound_config));
  }

  static fromSounds(sounds) {
    this.sounds = sounds;
  }

  play() {
    const startTime = Sound.audioContext.currentTime + 0.01;
    for (const sound of this.sounds) sound.play(startTime);
  }
}

function shiftFrequencies(frequencies, shift) {
  // creates an inverted tone moving the frecuencies to the left or right

  frequencies.sort();

  if (shift > 0) {
    for (let i = 0; i < shift; i++) {
      frequencies[0] *= 2;
      frequencies.sort();
    }
  } else if (shift < 0) {
    for (let i = 0; i < -shift; i++) {
      frequencies[0] /= 2;
      frequencies.sort();
    }
  }
}

export default Chord;
