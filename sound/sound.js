class Sound {
  // ----------------- Static definitions -----------------

  static audioContext = new AudioContext(); // There can only be one AudioContext per page

  static OSC_TYPES = {
    SINE: "sine",
    SQUARE: "square",
    SAWTOOTH: "sawtooth",
    TRIANGLE: "triangle",
  };

  static NOTES = {
    C: 16.35,
    "C#": 17.32,
    D: 18.35,
    "D#": 19.45,
    E: 20.6,
    F: 21.83,
    "F#": 23.12,
    G: 24.5,
    "G#": 25.96,
    A: 27.5,
    "A#": 29.14,
    B: 30.87,
  };
  static noteToFrequency(note, octave = 4) {
    return Sound.NOTES[note] * Math.pow(2, octave);
  }

  static FADE_TYPES = {
    EXPONENTIAL: "exponential",
    LINEAR: "linear",
    PULSE: [1, 0, 1, 0, 1, 0],
    DECRESCENDO: [1, 0.9, 0.7, 0.4, 0.2, 0.1, 0],
    CRESCENDO: [0, 0.1, 0.2, 0.4, 0.7, 0.9, 1, 0],
  };

  static DEFAULT_OSCTYPE = Sound.OSC_TYPES.SINE;
  static DEFAULT_FREQUENCY = 440;
  static DEFAULT_DURATION = 0.5;
  static DEFAULT_VOLUME = 0.5;
  static DEFAULT_FADE = Sound.FADE_TYPES.EXPONENTIAL;

  // ----------------- Constructors -----------------

  constructor(
    oscillatorType = Sound.DEFAULT_OSCTYPE,
    frequency = Sound.DEFAULT_FREQUENCY,
    duration = Sound.DEFAULT_DURATION,
    volume = Sound.DEFAULT_VOLUME,
    fade = Sound.DEFAULT_FADE
  ) {
    this.oscillatorType = oscillatorType;
    this.frequency = frequency;
    this.duration = duration;
    this.volume = Math.max(0, Math.min(1, volume));
    if (Array.isArray(fade)) this.fade = fade.map((v) => v * this.volume);
    else this.fade = fade;
  }
  static fromConfig(config) {
    return new Sound(
      config.oscillatorType,
      config.frequency,
      config.duration,
      config.volume,
      config.fade
    );
  }
  static fromFrequency(frequency, config = {}) {
    config.frequency = frequency;
    return Sound.fromConfig(config);
  }
  static fromNote(note, octave, config = {}) {
    config.frequency = Sound.noteToFrequency(note, octave);
    return Sound.fromConfig(config);
  }

  setup() {
    const oscillator = Sound.audioContext.createOscillator();
    const gainNode = Sound.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(Sound.audioContext.destination);

    oscillator.type = this.oscillatorType;
    oscillator.frequency.value = this.frequency;

    gainNode.gain.setValueAtTime(this.volume, Sound.audioContext.currentTime);

    return { oscillator, gainNode };
  }

  setFade(gainNode) {
    const endTime = Sound.audioContext.currentTime + this.duration;
    if (this.fade === Sound.FADE_TYPES.EXPONENTIAL)
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
    else if (this.fade === Sound.FADE_TYPES.LINEAR)
      gainNode.gain.linearRampToValueAtTime(0, endTime);
    else
      gainNode.gain.setValueCurveAtTime(
        this.fade, // Float32Array
        Sound.audioContext.currentTime,
        this.duration
      );
  }

  play() {
    const { oscillator, gainNode } = this.setup();

    oscillator.start(Sound.audioContext.currentTime);

    this.setFade(gainNode);

    const endTime = Sound.audioContext.currentTime + this.duration + 0.01;
    oscillator.stop(endTime);
  }
}

export default Sound;
