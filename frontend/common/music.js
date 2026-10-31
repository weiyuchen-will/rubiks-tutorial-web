const ENABLED_KEY = 'cube-arena-bg-music-enabled'
const VOLUME_KEY = 'cube-arena-bg-music-volume'

const track = {
  name: 'Trap Electro Vibes',
  artist: 'Alejandro Magaña (A. M.)',
  src: 'https://assets.mixkit.co/music/126/126.mp3'
}

let audio = null
let enabled = false
let volume = 0.6
let initialized = false

function readBool(key, fallback) {
  try {
    const value = uni.getStorageSync(key)
    if (value === '' || value === undefined || value === null) return fallback
    return value === true || value === 'true' || value === 1 || value === '1'
  } catch (error) {
    return fallback
  }
}

function readNumber(key, fallback) {
  try {
    const value = Number(uni.getStorageSync(key))
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback
  } catch (error) {
    return fallback
  }
}

function persist() {
  try {
    uni.setStorageSync(ENABLED_KEY, enabled ? '1' : '0')
    uni.setStorageSync(VOLUME_KEY, String(volume))
  } catch (error) {}
}

function ensureAudio() {
  if (audio) return audio
  if (!uni.createInnerAudioContext) return null
  audio = uni.createInnerAudioContext()
  audio.autoplay = false
  audio.loop = true
  audio.volume = volume
  audio.src = track.src
  audio.onError(() => {
    enabled = false
    persist()
  })
  return audio
}

function syncAudio() {
  const instance = ensureAudio()
  if (!instance) return
  instance.volume = volume
  if (enabled) {
    try {
      instance.play()
    } catch (error) {}
  } else {
    try {
      instance.pause()
    } catch (error) {}
  }
}

export function initBackgroundMusic() {
  if (initialized) return getMusicState()
  initialized = true
  enabled = readBool(ENABLED_KEY, false)
  volume = readNumber(VOLUME_KEY, 0.6)
  syncAudio()
  return getMusicState()
}

export function setMusicEnabled(next) {
  enabled = !!next
  persist()
  syncAudio()
  return getMusicState()
}

export function toggleMusic() {
  return setMusicEnabled(!enabled)
}

export function setMusicVolume(next) {
  const normalized = Number(next)
  volume = Number.isFinite(normalized) ? Math.min(1, Math.max(0, normalized)) : volume
  persist()
  syncAudio()
  return getMusicState()
}

export function getMusicState() {
  return {
    enabled,
    volume,
    track
  }
}

export function stopBackgroundMusic() {
  if (!audio) return
  try {
    audio.stop()
  } catch (error) {}
}
