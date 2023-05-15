const synth = {
  volume: 0,
  detune: 0,
  portamento: 0.05,
  envelope: {
    attack: 0.05,
    attackCurve: 'exponential',
    decay: 0.2,
    decayCurve: 'exponential',
    sustain: 0.2,
    release: 1.5,
    releaseCurve: 'exponential'
  },
  oscillator: {
    type: 'sine', // "fatsine" | "fatsquare" | "fatsawtooth" | "fattriangle" | "fatcustom" | FatTypeWithPartials | "fmsine" | "fmsquare" | "fmsawtooth" | "fmtriangle" | "fmcustom" | FMTypeWithPartials | "amsine" | "amsquare" | "amsawtooth" | "amtriangle" | "amcustom" | AMTypeWithPartials | TypeWithPartials | OscillatorType | "pulse" | "pwm"
    modulationType: 'sine',
    // partialCount: 0,
    // partials: [],
    phase: 0,
    harmonicity: 0.5
  }
}

const synthUI = {
  envelopeShow: false
}

const chorus = {
  wet: 0.3,
  type: 'sine',
  frequency: 10,
  delayTime: 10,
  depth: 0.7,
  spread: 180
}

const distortion = {
  wet: 0,
  distortion: 0,
  oversample: '4x'
}

const bitCrusher = {
  wet: 0,
  bits: 4
}

const pingPongDelay = { wet: 0.6, delayTime: 0.25, maxDelayTime: 1 }

const presets = {
  default: {
    synth: {
      volume: 0,
      detune: 0,
      portamento: 0.05,
      envelope: {
        attack: 0.05,
        attackCurve: 'exponential',
        decay: 0.2,
        decayCurve: 'exponential',
        sustain: 0.2,
        release: 1.5,
        releaseCurve: 'exponential'
      },
      oscillator: {
        type: 'sine', // "fatsine" | "fatsquare" | "fatsawtooth" | "fattriangle" | "fatcustom" | FatTypeWithPartials | "fmsine" | "fmsquare" | "fmsawtooth" | "fmtriangle" | "fmcustom" | FMTypeWithPartials | "amsine" | "amsquare" | "amsawtooth" | "amtriangle" | "amcustom" | AMTypeWithPartials | TypeWithPartials | OscillatorType | "pulse" | "pwm"
        modulationType: 'sine',
        // partialCount: 0,
        // partials: [],
        phase: 0,
        harmonicity: 0.5
      }
    },
    chorus: {
      wet: 0.3,
      type: 'sine',
      frequency: 10,
      delayTime: 10,
      depth: 0.7,
      spread: 180
    },
    distortion: { wet: 0, distortion: 0, oversample: '4x' },
    bitCrusher: { wet: 0, bits: 4 },
    pingPongDelay: { wet: 0.6, delayTime: 0.25, maxDelayTime: 1 }
  },
  preset1: {
    synth: {
      volume: 0,
      detune: 0,
      portamento: 0.05,
      envelope: {
        attack: 0.05,
        attackCurve: 'exponential',
        decay: 0.2,
        decayCurve: 'exponential',
        sustain: 0.2,
        release: 1.5,
        releaseCurve: 'exponential'
      },
      oscillator: {
        type: 'sine', // "fatsine" | "fatsquare" | "fatsawtooth" | "fattriangle" | "fatcustom" | FatTypeWithPartials | "fmsine" | "fmsquare" | "fmsawtooth" | "fmtriangle" | "fmcustom" | FMTypeWithPartials | "amsine" | "amsquare" | "amsawtooth" | "amtriangle" | "amcustom" | AMTypeWithPartials | TypeWithPartials | OscillatorType | "pulse" | "pwm"
        modulationType: 'sine',
        // partialCount: 0,
        // partials: [],
        phase: 0,
        harmonicity: 0.5
      }
    },
    chorus: {
      wet: 0.3,
      type: 'sine',
      frequency: 10,
      delayTime: 10,
      depth: 0.7,
      spread: 180
    },
    distortion: { wet: 0, distortion: 0, oversample: '2x' },
    bitCrusher: { wet: 0, bits: 4 },
    pingPongDelay: { wet: 0.6, delayTime: 0.25, maxDelayTime: 1 }
  },
  preset2: {
    synth: {
      volume: 0,
      detune: 0,
      portamento: 0.05,
      envelope: {
        attack: 0.9,
        attackCurve: 'exponential',
        decay: 0.4,
        decayCurve: 'exponential',
        sustain: 0.2,
        release: 1.5,
        releaseCurve: 'exponential'
      },
      oscillator: {
        type: 'triangle',
        modulationType: 'triangle',
        // partialCount: 0,
        // partials: [],
        phase: 0,
        harmonicity: 0.5
      }
    },
    chorus: {
      wet: 0.3,
      type: 'triangle',
      frequency: 10,
      delayTime: 4.5,
      depth: 0.7,
      spread: 180
    },
    distortion: { wet: 0.1, distortion: 0, oversample: '4x' },
    bitCrusher: { wet: 0.9, bits: 4 },
    pingPongDelay: { wet: 0.4, delayTime: 0.5, maxDelayTime: 1 }
  },
  current: 'default'
}

const sequence = {
  steps1: [
    {
      time: '0:0:0',
      noteName: 'A#2',
      duration: '1n',
      velocity: 1
    },
    {
      time: '0:0:2',
      noteName: 'G#3',
      duration: '4n',
      velocity: 1
    },
    {
      time: '0:1:0',
      noteName: 'A#3',
      duration: '4n',
      velocity: 1
    },
    {
      time: '0:2:0',
      noteName: 'C#3',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:0',
      noteName: 'D#3',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:1',
      noteName: 'A#3',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:2',
      noteName: 'F3',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:0:0',
      noteName: 'G#3',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:1:0',
      noteName: 'A#3',
      duration: '4n',
      velocity: 1
    },
    {
      time: '1:1:2',
      noteName: 'C#4',
      duration: '2n',
      velocity: 1
    },
    {
      time: '1:1:3',
      noteName: 'A#3',
      duration: '2n',
      velocity: 1
    },
    {
      time: '1:2:0',
      noteName: 'G#3',
      duration: '2n',
      velocity: 1
    }
  ],
  steps2: [
    {
      time: '0:0:0',
      noteName: 'A1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '0:0:2',
      noteName: 'B3',
      duration: '4n',
      velocity: 1
    },
    {
      time: '0:1:0',
      noteName: 'A3',
      duration: '4n',
      velocity: 1
    },
    {
      time: '0:2:0',
      noteName: 'B1',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:0',
      noteName: 'C4',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:1',
      noteName: 'A1',
      duration: '2n',
      velocity: 1
    },
    {
      time: '0:3:2',
      noteName: 'B4',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:0:0',
      noteName: 'C3',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:1:0',
      noteName: 'B1',
      duration: '4n',
      velocity: 1
    },
    {
      time: '1:1:2',
      noteName: 'C4',
      duration: '2n',
      velocity: 1
    },
    {
      time: '1:1:3',
      noteName: 'A1',
      duration: '2n',
      velocity: 1
    },
    {
      time: '1:2:0',
      noteName: 'F1',
      duration: '2n',
      velocity: 1
    }
  ],
  duration: '2m',
  loop: true,
  current: 'steps1'
}

export {
  synth,
  synthUI,
  chorus,
  distortion,
  bitCrusher,
  pingPongDelay,
  presets,
  sequence
}
