const STORAGE_KEY = 'cube-arena-theme'

export const themeOptions = [
  { label: '深色', value: 'dark' },
  { label: '浅色', value: 'light' }
]

let currentTheme = 'dark'

function applyDocumentTheme(theme) {
  try {
    const root = document.documentElement
    const body = document.body
    if (root) {
      root.setAttribute('data-theme', theme)
    }
    if (body) {
      body.setAttribute('data-theme', theme)
    }
  } catch (error) {}
}

function syncSystemChrome(theme) {
  try {
    if (uni.setNavigationBarColor) {
      uni.setNavigationBarColor({
        frontColor: theme === 'light' ? '#000000' : '#ffffff',
        backgroundColor: theme === 'light' ? '#f8fbff' : '#020617'
      })
    }
  } catch (error) {}
}

export function getTheme() {
  return currentTheme
}

export function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') return currentTheme
  currentTheme = theme
  try {
    uni.setStorageSync(STORAGE_KEY, theme)
  } catch (error) {}
  applyDocumentTheme(theme)
  syncSystemChrome(theme)
  if (uni.$emit) uni.$emit('theme:changed', theme)
  return currentTheme
}

export function initTheme() {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      currentTheme = saved
    }
  } catch (error) {}
  applyDocumentTheme(currentTheme)
  syncSystemChrome(currentTheme)
  return currentTheme
}
