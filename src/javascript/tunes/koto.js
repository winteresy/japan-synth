const channel = {
  volume: 0,
  mute: false
}

const sequence = {
  steps: [
    {
      time: '0:0:0',
      noteName: 'A1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '0:1:0',
      noteName: 'A2',
      duration: '1n',
      velocity: 1
    },
    {
      time: '0:2:0',
      noteName: 'B1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '0:3:0',
      noteName: 'B1',
      duration: '4n',
      velocity: 1
    },
    {
      time: '1:1:0',
      noteName: 'B1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:2:0',
      noteName: 'A1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '1:3:0',
      noteName: 'A1',
      duration: '1n',
      velocity: 1
    },
    {
      time: '2:1:0',
      noteName: 'A2',
      duration: '1n',
      velocity: 1
    },
    {
      time: '2:2:0',
      noteName: 'B1',
      duration: '1n',
      velocity: 1
    }
  ],
  duration: '2m',
  loop: true
}

export { channel, sequence }
