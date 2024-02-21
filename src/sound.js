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
    SPIKE: "spike",
    THUD: "thud",
    PULSE: "pulse",
  };

  static DEFAULT_OSCTYPE = Sound.OSC_TYPES.SINE;
  static DEFAULT_FREQUENCY = 440;
  static DEFAULT_DURATION = 0.5;
  static DEFAULT_VOLUME = 0.5;
  static DEFAULT_FADE = Sound.FADE_TYPES.EXPONENTIAL;

  static currentTime() {
    return Sound.audioContext.currentTime;
  }

  // ----------------- Constructors -----------------

  constructor(
    oscillatorType = Sound.DEFAULT_OSCTYPE,
    frequency = Sound.DEFAULT_FREQUENCY,
    duration = Sound.DEFAULT_DURATION,
    volume = Sound.DEFAULT_VOLUME,
    fade = Sound.DEFAULT_FADE,
    healthCheck = true
  ) {
    this.oscillatorType = oscillatorType;
    this.frequency = frequency;
    this.duration = duration;
    this.volume = Math.max(0, Math.min(1, volume));
    if (Array.isArray(fade)) this.fade = fade.map((v) => v * this.volume);
    else this.fade = fade;

    healthCheck && this.healthCheck();
  }
  static fromConfig(config) {
    return new Sound(
      config.oscillatorType,
      config.frequency,
      config.duration,
      config.volume,
      config.fade,
      config.healthCheck
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

  healthCheck() {
    if (!Object.values(Sound.OSC_TYPES).includes(this.oscillatorType))
      throw new Error("Invalid oscillator type: " + this.oscillatorType);

    if (this.frequency <= 0) throw new Error("Frequency must be positive");

    if (this.duration <= 0) throw new Error("Duration must be positive");

    if (
      !Array.isArray(this.fade) &&
      !Object.values(Sound.FADE_TYPES).includes(this.fade)
    )
      throw new Error("Invalid fade type");
  }

  // ----------------- Methods -----------------

  setup() {
    const oscillator = Sound.audioContext.createOscillator();
    const gainNode = Sound.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(Sound.audioContext.destination);

    oscillator.type = this.oscillatorType;
    oscillator.frequency.value = this.frequency;

    gainNode.gain.setValueAtTime(this.volume, Sound.currentTime());

    return { oscillator, gainNode };
  }

  setFade(gainNode) {
    FadeHandler.setFade(gainNode, this);
  }

  endTime() {
    return Sound.currentTime() + this.duration;
  }

  play(time = Sound.currentTime()) {
    const { oscillator, gainNode } = this.setup();

    oscillator.start(time);

    this.setFade(gainNode);

    const endTime = time + this.duration + 0.01;
    oscillator.stop(endTime);
  }
}

export default Sound;

class FadeHandler {
  static ARRAY_PRECISION = 1000;

  static setFade(gainNode, sound) {
    if (sound.fade === Sound.FADE_TYPES.EXPONENTIAL)
      FadeHandler.exponential(gainNode, sound);
    else if (sound.fade === Sound.FADE_TYPES.LINEAR)
      FadeHandler.linear(gainNode, sound);
    else if (sound.fade === Sound.FADE_TYPES.SPIKE)
      FadeHandler.spike(gainNode, sound);
    else if (sound.fade === Sound.FADE_TYPES.THUD)
      FadeHandler.thud(gainNode, sound);
    else if (sound.fade === Sound.FADE_TYPES.PULSE)
      FadeHandler.pulse(gainNode, sound);
    else if (Array.isArray(sound.fade)) FadeHandler.custom(gainNode, sound);
  }

  static exponential(gainNode, sound) {
    gainNode.gain.exponentialRampToValueAtTime(0.001, sound.endTime());
  }

  static linear(gainNode, sound) {
    gainNode.gain.linearRampToValueAtTime(0, sound.endTime());
  }

  static spike(gainNode, sound) {
    const valueArray = new Float32Array(FadeHandler.ARRAY_PRECISION);
    const half = FadeHandler.ARRAY_PRECISION / 2;
    for (let i = 0; i < half; i++) {
      valueArray[i] = (i / half) * sound.volume;
      valueArray[FadeHandler.ARRAY_PRECISION - i - 1] = valueArray[i];
    }
    FadeHandler.custom(gainNode, sound, valueArray);
  }

  static thud(gainNode, sound) {
    const exp = 2;
    const valueArray = new Float32Array(FadeHandler.ARRAY_PRECISION);
    const half = FadeHandler.ARRAY_PRECISION / 2;
    for (let i = 0; i < half; i++) {
      valueArray[i] = (sound.volume * i ** exp) / half ** exp;
      valueArray[FadeHandler.ARRAY_PRECISION - i - 1] = valueArray[i];
    }
    FadeHandler.custom(gainNode, sound, valueArray);
  }

  static pulse(gainNode, sound) {
    const valueArray = new Float32Array(FadeHandler.ARRAY_PRECISION);
    const lim = FadeHandler.ARRAY_PRECISION;
    for (let i = 0; i < lim; i++) {
      valueArray[i] = Math.sin((i / lim) * Math.PI);
      if (valueArray[i] < 0.5) valueArray[i] *= 2 * valueArray[i];
      else valueArray[i] = 1 - (1 - valueArray[i]) ** 2;
      valueArray[i] *= sound.volume;
    }
    FadeHandler.custom(gainNode, sound, valueArray);
  }

  static custom(gainNode, sound, valueArray) {
    gainNode.gain.setValueCurveAtTime(
      valueArray, // Float32Array
      Sound.audioContext.currentTime,
      sound.duration
    );
  }
}
