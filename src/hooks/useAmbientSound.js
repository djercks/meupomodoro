import { useEffect, useRef } from 'react'

function createNoiseBuffer(ctx, seconds) {
  const bufferSize = ctx.sampleRate * seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function createPinkNoiseBuffer(ctx, seconds) {
  const bufferSize = ctx.sampleRate * seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
    b6 = white * 0.115926
    data[i] = pink * 0.11
  }
  return buffer
}

// Toca ruído gerado no navegador (sem arquivos de áudio) filtrado de formas
// diferentes para simular chuva, café, ondas do mar ou ruído branco puro.
export function useAmbientSound(type, volume) {
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)

  useEffect(() => {
    function stopCurrent() {
      if (nodesRef.current) {
        try {
          nodesRef.current.source.stop()
          nodesRef.current.lfo?.stop()
        } catch {
          // já parado
        }
        nodesRef.current = null
      }
    }

    stopCurrent()
    if (!type || type === 'off') return undefined

    const ctx = ctxRef.current || new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume()

    const gain = ctx.createGain()
    gain.gain.value = volume
    gain.connect(ctx.destination)

    let source
    let lfo = null

    if (type === 'cafe') {
      source = ctx.createBufferSource()
      source.buffer = createPinkNoiseBuffer(ctx, 4)
      source.loop = true
      const lowpass = ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 2200
      source.connect(lowpass)
      lowpass.connect(gain)
    } else if (type === 'rain') {
      source = ctx.createBufferSource()
      source.buffer = createNoiseBuffer(ctx, 4)
      source.loop = true
      const highpass = ctx.createBiquadFilter()
      highpass.type = 'highpass'
      highpass.frequency.value = 900
      const lowpass = ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 7000
      source.connect(highpass)
      highpass.connect(lowpass)
      lowpass.connect(gain)
    } else if (type === 'waves') {
      source = ctx.createBufferSource()
      source.buffer = createNoiseBuffer(ctx, 4)
      source.loop = true
      const lowpass = ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 500
      source.connect(lowpass)
      lowpass.connect(gain)

      lfo = ctx.createOscillator()
      lfo.frequency.value = 0.15
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 350
      lfo.connect(lfoGain)
      lfoGain.connect(lowpass.frequency)
      lfo.start()
    } else {
      source = ctx.createBufferSource()
      source.buffer = createNoiseBuffer(ctx, 4)
      source.loop = true
      source.connect(gain)
    }

    source.start()
    nodesRef.current = { source, gain, lfo }

    return stopCurrent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (nodesRef.current) nodesRef.current.gain.gain.value = volume
  }, [volume])

  useEffect(
    () => () => {
      if (nodesRef.current) {
        try {
          nodesRef.current.source.stop()
          nodesRef.current.lfo?.stop()
        } catch {
          // já parado
        }
      }
    },
    []
  )
}
