import Sound from "./sound.js";

class Chord {
  static TYPES = {
    MAJOR: [0, 4, 7],
    SEVENTH: [0, 4, 7, 10],
    NINTH: [0, 4, 7, 10, 14],
    ELEVENTH: [0, 4, 7, 10, 14, 17],
    THIRTEENTH: [0, 4, 7, 10, 14, 17, 21],

    MINOR: [0, 3, 7],
    MINOR_SEVENTH: [0, 3, 7, 10],
    MINOR_NINTH: [0, 3, 7, 10, 14],
    MINOR_ELEVENTH: [0, 3, 7, 10, 14, 17],
    MINOR_THIRTEENTH: [0, 3, 7, 10, 14, 17, 21],

    AUGMENTED: [0, 4, 8],
    DIMINISHED: [0, 3, 6],
    SUSPENDED: [0, 5, 7],
    POWER: [0, 7],
  };

  static DEFAULT_TYPE = Chord.TYPES.MAJOR;
  static DEFAULT_FREQUENCY = 440;

  constructor(type = Chord.DEFAULT_TYPE, sound_config) {
    const frequency = sound_config.frequency || Chord.DEFAULT_FREQUENCY;

    this.sounds = type.map((interval) => {
      return Sound.fromFrequency(
        frequency * Math.pow(2, interval / 12),
        sound_config
      );
    });
  }

  static fromSounds(sounds) {
    this.sounds = sounds;
  }

  play() {
    const startTime = Sound.audioContext.currentTime + 0.01;
    for (const sound of this.sounds) sound.play(startTime);
  }
}

export default Chord;
