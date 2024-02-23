import Sound from "./sound.js";
import {
  createTriangleHarmonics,
  createSawtoothHarmonics,
  createSquareHarmonics,
  createRuggedHarmonics,
} from "./harmonics.js";

class Chord {
  static _TYPES = {
    NOTE: [0],

    _MAJOR: "MAJOR",
    MAJOR: [0, 4, 7],
    SEVENTH: [0, 4, 7, 10],
    NINTH: [0, 4, 7, 10, 14],

    _MINOR: "MINOR",
    MINOR: [0, 3, 7],
    MINOR_SEVENTH: [0, 3, 7, 10],
    MINOR_NINTH: [0, 3, 7, 10, 14],

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
    MOST: [0, 4, 7, 9 - 12],
    LEAST: [0, 3, 7, 12 - 12],

    _MATH: "MATH",
    FIBONACCI: [1, 2, 3, 5, 8],
    PRIME: [2, 3, 5, 7, 11],
    SQUARE: [1, 4, 9, 16],
  };

  static TYPES = Object.keys(Chord._TYPES).reduce((acc, key) => {
    if (!key.startsWith("_")) acc[key] = Chord._TYPES[key];
    return acc;
  }, {});

  static _HARMONICS = {
    NONE: [0],

    _COMMON_P3: "COMMON_P3",
    SQR_3: createSquareHarmonics(3),
    SAW_3: createSawtoothHarmonics(3),
    TRI_3: createTriangleHarmonics(3),

    _COMMON_P5: "COMMON_P5",
    SQR_5: createSquareHarmonics(5),
    SAW_5: createSawtoothHarmonics(5),
    TRI_5: createTriangleHarmonics(5),

    _RUGGED: "RUGGED",
    RUG_2: createRuggedHarmonics(2),
    RUG_3: createRuggedHarmonics(3),
    RUG_5: createRuggedHarmonics(5),
  };
  static HARMONICS = Object.keys(Chord._HARMONICS).reduce((acc, key) => {
    if (!key.startsWith("_")) acc[key] = Chord._HARMONICS[key];
    return acc;
  }, {});

  static DEFAULT_TYPE = Chord.TYPES.MAJOR;
  static DEFAULT_HARMONICS = Chord.HARMONICS.NONE;
  static DEFAULT_FREQUENCY = 440;

  constructor(frequencies, sound_config) {
    const vol = sound_config.volume ?? Sound.DEFAULT_VOLUME;
    this.sounds = frequencies.map((f) => {
      // if number: is frequency
      if (typeof f === "number") return Sound.fromFrequency(f, sound_config);
      // if array: first number is frequency, second is volume
      if (Array.isArray(f))
        return Sound.fromFrequency(f[0], {
          ...sound_config,
          volume: f[1] * vol,
        });
    });
  }

  static fromSound(
    sound_config,
    type = Chord.DEFAULT_TYPE,
    harmonics = Chord.DEFAULT_HARMONICS
  ) {
    const frequencies = chordFrequencies(type, sound_config);
    const expandedFrequencies = expandHarmonics(frequencies, harmonics);
    return new Chord(expandedFrequencies, sound_config);
  }

  play() {
    const startTime = Sound.audioContext.currentTime + 0.01;
    for (const sound of this.sounds) sound.play(startTime);
  }
}

function expandHarmonics(frequencies, harmonics) {
  let expandedFrequencies = [];
  for (const h of harmonics) {
    const [interval, volume] = Array.isArray(h) ? h : [h, 1];
    for (const frequency of frequencies) {
      expandedFrequencies.push([frequency * 2 ** interval, volume]);
    }
  }
  return expandedFrequencies;
}

function chordFrequencies(type = Chord.DEFAULT_TYPE, sound_config) {
  const frequency = sound_config.frequency ?? Chord.DEFAULT_FREQUENCY;
  const shift = sound_config.shift ?? 0;

  let frequencies = type.map(
    (interval) => frequency * Math.pow(2, (interval + shift) / 12)
  );

  shiftFrequencies(frequencies, shift);

  return frequencies;
}

function shiftFrequencies(frequencies, shift) {
  // creates an inverted tone moving the frequencies to the left or right

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
