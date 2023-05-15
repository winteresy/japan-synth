import * as Tone from 'tone'
import React, { Component } from 'react'

import * as melodySettings from './tunes/melody.js'
import * as kotoSettings from './tunes/koto.js'

import ToneSynth from './modules/ToneSynth.jsx'
import ChorusEffect from './modules/ChorusEffect.jsx'
import DistortionEffect from './modules/DistortionEffect.jsx'
import BitCrusherEffect from './modules/BitCrusherEffect.jsx'
import PingPongDelayEffect from './modules/PingPongDelayEffect.jsx'
import Channel from './modules/Channel.jsx'

import SC_ToggleButtonSet from './components/SC_ToggleButtonSet.jsx'
import SC_ToggleButton from './components/SC_ToggleButton.jsx'
import SC_Button from './components/SC_Button.jsx'
import SC_Slider from './components/SC_Slider.jsx'
import SC_Knob from './components/SC_Knob.jsx'
import Surface from './components/Surface.jsx'
import Select from './components/Select.jsx'

let melodySynth
let melodyChorus
let melodyDistortion
let melodyBitCrusher
let melodyPingPongDelay
let melodyPart

let sampler
let samplerChannel

export default class Container extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isStarted: false,
      isUIShown: false,
      bpm: 80,
      melodyChangeMeasureSelect: false,
      melodyChangeMeasure: 8,
      melodyChangeRandom: false,
      melodyChange: false,
      random: false,
      melodySettings,
      kotoSettings
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown)

    document.addEventListener(
      'click',
      this.handleMelodyChangeMeasureSelectClose
    )
  }

  shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      // prettier-ignore
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ]
    }

    return array
  }

  handleMelodyChangeMeasureSelectClose = (e) => {
    const { isUIShown } = this.state

    if (e.target.classList[0] != 'currentValue') {
      this.setState({
        melodyChangeMeasureSelect: false
      })
    }
  }

  handleMelodyChangeMeasureSelectOpen = () => {
    console.log('handleMelodyChangeMeasureSelectOpen')

    this.setState({
      melodyChangeMeasureSelect: true
    })
  }

  handleMelodyChangeMeasure = (property, value) => {
    this.setState({
      melodyChangeMeasureSelect: false,
      melodyChangeMeasure: value
    })
  }

  handleMelodyChangeRandom = () => {
    const { melodyChangeRandom } = this.state

    this.setState({
      melodyChangeRandom: !melodyChangeRandom
    })
  }

  handleMelodyChange = () => {
    const { melodyChange } = this.state

    this.setState({
      melodyChange: !melodyChange
    })
  }

  handleStart = () => {
    const { melodySettings, kotoSettings } = this.state

    //
    //
    //
    melodySynth = new Tone.Synth(melodySettings.synth)
    melodyChorus = new Tone.Chorus(melodySettings.chorus).start()
    melodyDistortion = new Tone.Distortion(melodySettings.distortion)
    melodyBitCrusher = new Tone.BitCrusher(melodySettings.bitCrusher)

    melodyPingPongDelay = new Tone.PingPongDelay(
      melodySettings.pingPongDelay
    ).toDestination()

    melodySynth.chain(
      melodyChorus,
      melodyDistortion,
      melodyBitCrusher,
      melodyPingPongDelay
    )

    melodyPart = new Tone.Part((time, note) => {
      melodySynth.triggerAttackRelease(
        note.noteName,
        note.duration,
        time,
        note.velocity
      )
    }, melodySettings.sequence[melodySettings.sequence.current]).start(0)

    melodyPart.loopEnd = melodySettings.sequence.duration
    melodyPart.loop = melodySettings.sequence.loop

    sampler = new Tone.Sampler({
      urls: {
        A1: 'koto-japanese-melody-strings-loop_123bpm_D_minor.wav',
        A2: 'spanish-guitar-koto-arp-loop_234bpm_F_minor.wav',
        A3: 'sharingan-koto-melody_130bpm_A_minor.wav',
        B1: 'spanish-guitar-koto-arp-loop_234bpm_F_minor.wav',
        B2: 'kioto.mp3'
      },
      baseUrl: '/samples/'
    })

    samplerChannel = new Tone.Channel(kotoSettings.channel).toDestination()

    sampler.chain(samplerChannel)

    const kotoPart = new Tone.Part((time, note) => {
      sampler.triggerAttackRelease(
        note.noteName,
        note.duration,
        time,
        note.velocity
      )
    }, kotoSettings.sequence.steps).start(0)

    kotoPart.loopEnd = kotoSettings.sequence.duration
    kotoPart.loop = kotoSettings.sequence.loop

    this.handleTransportChange('play', true)
  }

  nextMeasure = () => {
    const { melodyChangeMeasure, melodyChangeRandom, melodyChange } = this.state

    if (melodyChange) {
      const position = Tone.Transport.position
      const regexBefore = /([\w]+)/
      let measure = parseInt(position.match(regexBefore)[1]) + 1
      console.log('next measure', measure)

      const squaresPassed = Math.floor(measure / melodyChangeMeasure)

      if (
        measure == melodyChangeMeasure ||
        measure - squaresPassed * melodyChangeMeasure == 0
      ) {
        console.log('change')
        melodyPart.clear()

        if (melodyChangeRandom) {
          console.log('random')

          let notes = []

          melodySettings.sequence.steps2.forEach((item, i) => {
            notes.push(item.noteName)
          })

          notes = this.shuffle(notes)

          let randomizedSequence = [...melodySettings.sequence.steps2]

          randomizedSequence.forEach((step, i) => {
            let newStep = Object.assign({}, step)
            newStep.noteName = notes[i]
            melodyPart.add(newStep)
          })
        } else {
          melodySettings.sequence.steps2.forEach((step, i) => {
            melodyPart.add(step)
          })
        }
      } else if (
        measure == melodyChangeMeasure + 1 ||
        measure - squaresPassed * melodyChangeMeasure == 1
      ) {
        console.log('change back')
        melodyPart.clear()

        melodySettings.sequence.steps1.forEach((step, i) => {
          melodyPart.add(step)
        })
      }
    }
  }

  handleTransportChange = (property, value) => {
    const { bpm } = this.state

    switch (property) {
      case 'play':
        Tone.Transport.start()
        Tone.Transport.scheduleRepeat(this.nextMeasure, '1m')

        this.setState({
          isStarted: true
        })
        break
      case 'bpm':
        Tone.Transport.bpm.value = value

        this.setState({
          bpm: value
        })
        break
    }
  }

  handleValueChange = (instrumentName, property, value) => {
    const { melodySettings } = this.state

    let instrument
    let chorus
    let distortion
    let pingPongDelay
    let bitCrusher
    let settings

    if (instrumentName === 'melody') {
      instrument = melodySynth
      chorus = melodyChorus
      distortion = melodyDistortion
      pingPongDelay = melodyPingPongDelay
      bitCrusher = melodyBitCrusher
      settings = melodySettings
    }

    switch (property) {
      case 'synthType':
        instrument.oscillator.type = value
        settings.synth.oscillator.type = value
        break
      case 'synthShowEnvelope':
        settings.synthUI.envelopeShow = value
        break
      case 'synthEnvelopeAttack':
        instrument.envelope.attack = value
        settings.synth.envelope.attack = value
        break
      case 'synthEnvelopeDecay':
        instrument.envelope.decay = value
        settings.synth.envelope.decay = value
        break
      case 'synthEnvelopeSustain':
        instrument.envelope.sustain = value
        settings.synth.envelope.sustain = value
        break
      case 'synthEnvelopeRelease':
        instrument.envelope.release = value
        settings.synth.envelope.release = value
        break
      case 'chorusWet':
        chorus.wet.value = value
        settings.chorus.wet = value
        break
      case 'chorusType':
        chorus.type = value
        settings.chorus.type = value
        break
      case 'chorusFrequency':
        chorus.frequency.value = value
        settings.chorus.frequency = value
        break
      case 'chorusDelayTime':
        chorus.delayTime = value
        settings.chorus.delayTime = value
        break
      case 'chorusDepth':
        chorus.depth = value
        settings.chorus.depth = value
        break
      case 'chorusSpread':
        chorus.spread = value
        settings.chorus.spread = value
        break
      case 'distortionWet':
        distortion.wet.value = value
        settings.distortion.wet = value
        break
      case 'distortionDistortion':
        distortion.distortion = value
        settings.distortion.distortion = value
        break
      case 'distortionOversample':
        distortion.oversample = value
        settings.distortion.oversample = value
        break
      case 'bitCrusherWet':
        bitCrusher.wet.value = value
        settings.bitCrusher.wet = value
        break
      case 'bitCrusherBits':
        bitCrusher.bits = value
        settings.bitCrusher.bits = value
        break
      case 'pingPongDelayWet':
        pingPongDelay.wet.value = value
        settings.pingPongDelay.wet = value
        break
      case 'pingPongDelayDelayTime':
        pingPongDelay.delayTime.value = value
        settings.pingPongDelay.delayTime = value
        break
      case 'pingPongDelayMaxDelayTime':
        pingPongDelay.maxDelayTime = value
        settings.pingPongDelay.maxDelayTime = value
        break
    }

    this.setState({
      melodySettings
    })
  }

  handleMelodySoundPresetChange = (property, value) => {
    const { melodySettings } = this.state
    const preset = melodySettings.presets[value]

    const instrument = melodySynth
    const chorus = melodyChorus
    const distortion = melodyDistortion
    const pingPongDelay = melodyPingPongDelay
    const bitCrusher = melodyBitCrusher
    const settings = melodySettings

    const { oscillator, envelope } = preset.synth

    instrument.oscillator.type = oscillator.type
    settings.synth.oscillator.type = oscillator.type

    instrument.envelope.attack = envelope.attack
    settings.synth.envelope.attack = envelope.attack

    instrument.envelope.decay = envelope.decay
    settings.synth.envelope.decay = envelope.decay

    instrument.envelope.sustain = envelope.sustain
    settings.synth.envelope.sustain = envelope.sustain

    instrument.envelope.release = envelope.release
    settings.synth.envelope.release = envelope.release

    chorus.wet.value = preset.chorus.wet
    settings.chorus.wet = preset.chorus.wet

    chorus.type = preset.chorus.type
    settings.chorus.type = preset.chorus.type

    chorus.frequency.value = preset.chorus.frequency
    settings.chorus.frequency = preset.chorus.frequency

    chorus.delayTime = preset.chorus.delayTime
    settings.chorus.delayTime = preset.chorus.delayTime

    chorus.depth = preset.chorus.depth
    settings.chorus.depth = preset.chorus.depth

    chorus.spread = preset.chorus.spread
    settings.chorus.spread = preset.chorus.spread

    distortion.wet.value = preset.distortion.wet
    settings.distortion.wet = preset.distortion.wet

    distortion.distortion = preset.distortion.distortion
    settings.distortion.distortion = preset.distortion.distortion

    distortion.oversample = preset.distortion.oversample
    settings.distortion.oversample = preset.distortion.oversample

    bitCrusher.wet.value = preset.bitCrusher.wet
    settings.bitCrusher.wet = preset.bitCrusher.wet

    bitCrusher.bits = preset.bitCrusher.bits
    settings.bitCrusher.bits = preset.bitCrusher.bits

    pingPongDelay.wet.value = preset.pingPongDelay.wet
    settings.pingPongDelay.wet = preset.pingPongDelay.wet

    pingPongDelay.delayTime.value = preset.pingPongDelay.delayTime
    settings.pingPongDelay.delayTime = preset.pingPongDelay.delayTime

    pingPongDelay.maxDelayTime = preset.pingPongDelay.maxDelayTime
    settings.pingPongDelay.maxDelayTime = preset.pingPongDelay.maxDelayTime

    settings.presets.current = value

    this.setState({
      melodySettings
    })
  }

  handleMelodySequenceChange = (property, value) => {
    const { melodySettings } = this.state
    const steps = melodySettings.sequence[value]

    melodySettings.sequence.current = value
    melodyPart.clear()

    steps.forEach((step, i) => {
      melodyPart.add(step)
    })

    this.setState({
      melodySettings
    })
  }

  handleKotoValueChange = (property, value) => {
    const { kotoSettings } = this.state

    if (property === 'channelVolume') {
      samplerChannel.volume.value = value
      kotoSettings.channel.volume = value
    } else if (property === 'channelMute') {
      console.log(
        '=====BEFORE=====',
        kotoSettings.channel.mute,
        samplerChannel.mute,
        kotoSettings.channel.mute,
        samplerChannel
      )

      const mute = !kotoSettings.channel.mute
      samplerChannel.mute = mute
      kotoSettings.channel.mute = mute

      console.log(
        '=====AFTER=====',
        mute,
        samplerChannel.mute,
        kotoSettings.channel.mute,
        samplerChannel
      )
    } else if (property === 'channelPan') {
      samplerChannel.pan.value = value
      kotoSettings.channel.pan = value
    }

    this.setState({
      kotoSettings
    })
  }

  handleToggleUIShow = () => {
    const { isUIShown } = this.state

    this.setState({
      isUIShown: !isUIShown
    })
  }

  renderStartButton = () => {
    return (
      <div className="StartWindow">
        <div className="Text">
          <svg
            width="901"
            height="98vh"
            viewBox="0 0 901 882"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 659.077L30.5324 865.038H39.3314V743.885L28.1567 16.9615H0V138.115H21.0295L30.0925 726.923L0 523.385V659.077Z"
              fill="white"
            />
            <path
              d="M75.2167 523.385L52.9553 720.865V193.846L75.2167 523.385ZM81.376 613.038L98.446 865.038H110.501L52.9553 16.9615H44.1564V865.038H52.9553L81.376 613.038Z"
              fill="white"
            />
            <path
              d="M121.529 238.673C121.529 173.25 125.4 119.942 130.152 119.942C134.815 119.942 138.687 173.25 138.687 238.673C138.687 304.096 134.815 357.404 130.152 357.404C125.4 357.404 121.529 304.096 121.529 238.673ZM121.529 865.038V447.058C124.08 467.654 126.984 478.558 130.152 478.558C139.743 478.558 147.486 370.731 147.486 238.673C147.486 106.615 139.743 0 130.152 0C126.984 0 124.08 10.9038 121.529 31.5V16.9615H112.73V865.038H121.529Z"
              fill="white"
            />
            <path
              d="M184.265 523.385L162.004 720.865V193.846L184.265 523.385ZM190.425 613.038L207.495 865.038H219.549L162.004 16.9615H153.205V865.038H162.004L190.425 613.038Z"
              fill="white"
            />
            <path
              d="M217.379 865.038H226.794L245.184 190.212L263.486 865.038H278.444V16.9615H269.645V745.096L249.847 16.9615H240.432L217.379 865.038Z"
              fill="white"
            />
            <path
              d="M334.64 882V760.846C321.794 760.846 311.411 617.885 311.411 441C311.411 264.115 321.794 121.154 334.64 121.154C347.487 121.154 357.87 264.115 357.87 441V442.212H366.669V441C366.669 197.481 352.326 0 334.64 0C316.954 0 302.612 197.481 302.612 441C302.612 684.519 316.954 882 334.64 882Z"
              fill="white"
            />
            <path
              d="M382.01 16.9615H371.1L406.383 679.673V743.885H372.683V865.038H415.182V16.9615H406.383V474.923L382.01 16.9615Z"
              fill="white"
            />
            <path
              d="M431.06 513.692H456.929C461.504 513.692 465.288 565.788 465.288 628.788C465.288 691.788 461.504 743.885 456.929 743.885H431.06V513.692ZM431.06 392.538V138.115H447.602V392.538H431.06ZM457.017 865.038C466.432 865.038 474.087 759.635 474.087 630C474.087 497.942 466.432 392.538 457.017 392.538H456.929V16.9615H422.261V865.038H457.017Z"
              fill="white"
            />
            <path
              d="M486.787 385.269C488.459 254.423 495.85 151.442 505.265 127.212V385.269H486.787ZM514.064 3.63464C512.656 1.21152 511.16 0 509.664 0C491.978 0 477.636 197.481 477.636 441C477.636 684.519 491.978 882 509.664 882C525.766 882 539.053 718.442 541.34 506.423H532.365C530.254 651.808 520.839 760.846 509.664 760.846C498.489 760.846 489.075 651.808 486.963 506.423H514.064V3.63464Z"
              fill="white"
            />
            <path
              d="M563.597 357.404C558.845 357.404 554.974 304.096 554.974 238.673C554.974 173.25 558.845 119.942 563.597 119.942C568.26 119.942 572.132 173.25 572.132 238.673C572.132 304.096 568.26 357.404 563.597 357.404ZM596.857 865.038L568.172 470.077C575.564 442.212 580.931 348.923 580.931 238.673C580.931 106.615 573.188 0 563.597 0C560.429 0 557.526 10.9038 554.974 31.5V16.9615H546.175V865.038H554.974V460.385L584.362 865.038H596.857Z"
              fill="white"
            />
            <path
              d="M625.069 138.115L645.57 743.885L620.581 545.192L616.182 649.385L643.283 865.038H655.425V748.731L634.748 138.115L659.737 336.808L664.136 232.615L637.035 16.9615H625.069V138.115Z"
              fill="white"
            />
            <path
              d="M679.426 16.9615H668.515L703.799 679.673V743.885H670.099V865.038H712.598V16.9615H703.799V474.923L679.426 16.9615Z"
              fill="white"
            />
            <path
              d="M715.277 865.038H724.691L743.081 190.212L761.383 865.038H776.341V16.9615H767.542V745.096L747.745 16.9615H738.33L715.277 865.038Z"
              fill="white"
            />
            <path
              d="M787.002 743.885V865.038H798.968L826.069 649.385L821.67 545.192L796.681 743.885L817.094 138.115H839.796V16.9615H783.834V138.115H807.503L787.002 743.885Z"
              fill="white"
            />
            <path
              d="M845.567 865.038H854.366V501.577L892.201 450.692V865.038H901V16.9615H892.201V328.327L854.366 381.635V16.9615H845.567V865.038Z"
              fill="white"
            />
          </svg>
        </div>
        <SC_Button text="Start" handleClick={this.handleStart} />
        <div className="Rectangle1"></div>
        <div className="Rectangle2"></div>
        <div className="Rectangle3"></div>
        <div className="Rectangle4"></div>
        <div className="Rectangle5"></div>
        <div className="Rectangle6"></div>
        <div className="Rectangle7"></div>
        <div className="Rectangle8"></div>
        <div className="Rectangle9"></div>
        <div className="Rectangle10"></div>
        <div className="Rectangle11"></div>
        <div className="Rectangle12"></div>
      </div>
    )
  }

  renderShowHideButton = () => {
    return (
      <div className="ContainerUI">
        <div className="ContainerWithDog"></div>
        <div className="toggleUIButton" onClick={this.handleToggleUIShow}>
          Show/Hide UI
        </div>
      </div>
    )
  }

  renderUI = () => {
    const {
      bpm,
      melodyChangeMeasureSelect,
      melodyChangeMeasure,
      melodyChangeRandom,
      melodyChange,
      melodySettings,
      kotoSettings
    } = this.state

    const melodyChangeButtonText = melodyChange ? 'On' : 'Off'

    return (
      <div className="instrumentUI">
        <div className="SynthContainer">
          <div className="SynthContainerFlex">
            <div className="ChannelContainer">
              <h3>Koto melody</h3>
              <Channel
                settings={kotoSettings}
                handleValueChange={this.handleKotoValueChange}
              />
            </div>
            <div className="SampleAndBPMContainer">
              <div className="BPMContainer">
                <h3>BPM</h3>
                <SC_Slider
                  name="BPM Value"
                  min={0}
                  max={300}
                  step={1}
                  value={bpm}
                  property="bpm"
                  handleChange={(property, value) => {
                    this.handleTransportChange(property, value)
                  }}
                />
              </div>
              <SC_Button
                text="Sample 1"
                handleClick={() => {
                  sampler.triggerAttackRelease('A4', '1n')
                }}
              />

              <SC_Button
                text="Sample 2"
                handleClick={() => {
                  sampler.triggerAttackRelease('B2', '1n')
                }}
              />
            </div>

            <ToneSynth
              instrumentName="melody"
              settings={melodySettings}
              handleValueChange={this.handleValueChange}
            />
            <div className="SequenceContainer">
              <SC_ToggleButtonSet
                name="Sequence"
                options={['steps1', 'steps2']}
                value={melodySettings.sequence.current}
                property="melodySequence"
                handleChange={this.handleMelodySequenceChange}
              />
            </div>
            <div className="SoundContainer">
              <SC_ToggleButtonSet
                name="Sound"
                options={['default', 'preset1', 'preset2']}
                value={melodySettings.presets.current}
                property="melodySoundPreset"
                handleChange={this.handleMelodySoundPresetChange}
              />
            </div>

            <Select
              name="Change melody on measure"
              options={[2, 4, 8, 16, 32]}
              isOpened={melodyChangeMeasureSelect}
              value={melodyChangeMeasure}
              property=""
              handleMelodyChangeMeasureSelectOpen={
                this.handleMelodyChangeMeasureSelectOpen
              }
              handleMelodyChangeMeasureSelectClose={
                this.handleMelodyChangeMeasureSelectClose
              }
              handleChange={this.handleMelodyChangeMeasure}
            />

            <div className="OffRandomContainer">
              <SC_ToggleButton
                text={melodyChangeButtonText}
                isOn={melodyChange}
                handleClick={this.handleMelodyChange}
              />

              <SC_ToggleButton
                text="Random"
                isOn={melodyChangeRandom}
                handleClick={this.handleMelodyChangeRandom}
              />
            </div>

            <ChorusEffect
              title="Chorus"
              instrumentName="melody"
              settings={melodySettings}
              handleValueChange={this.handleValueChange}
            />

            <DistortionEffect
              title="Distortion"
              instrumentName="melody"
              settings={melodySettings}
              handleValueChange={this.handleValueChange}
            />

            <BitCrusherEffect
              title="BitCrusher"
              instrumentName="melody"
              settings={melodySettings}
              handleValueChange={this.handleValueChange}
            />

            <PingPongDelayEffect
              title="Ping Pong Delay"
              instrumentName="melody"
              settings={melodySettings}
              handleValueChange={this.handleValueChange}
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { isStarted, isUIShown } = this.state

    return (
      <div className="Container">
        {isStarted ? this.renderShowHideButton() : this.renderStartButton()}
        {isUIShown ? this.renderUI() : ''}
      </div>
    )
  }
}
