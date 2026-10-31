<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleSettings') }}</text>
      <view class="icon-btn">⚙</view>
    </view>

    <view class="glass-card card">
      <text class="title">{{ $t('settingsAccount') }}</text>
      <text class="desc">{{ $t('commonMockDesc') }}</text>
    </view>

    <KafangAssistant message="语言、主题、音乐都在这儿，我帮你把手感调顺。" mood="cocky" tone="cyan" voice-pack="settings" />

    <view class="section-head">
      <text class="section-title">{{ $t('titleLanguage') }}</text>
      <text class="muted">{{ currentLanguageLabel }}</text>
    </view>

    <view class="setting-card glass-card">
      <view class="setting-copy">
        <text class="setting-title">{{ $t('settingsLanguage') }}</text>
        <text class="setting-desc">{{ $t('settingsLanguageDesc') }}</text>
      </view>
      <view class="language-options">
        <view
          v-for="item in languageOptions"
          :key="item.value"
          class="language-chip pressable"
          :class="{ active: language === item.value }"
          @tap="chooseLanguage(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('themeTitle') }}</text>
      <text class="muted">{{ currentThemeLabel }}</text>
    </view>

    <view class="setting-card glass-card">
      <view class="setting-copy">
        <text class="setting-title">{{ $t('titleTheme') }}</text>
        <text class="setting-desc">{{ $t('themeDesc') }}</text>
      </view>
      <view class="theme-options">
        <view
          v-for="item in themeOptions"
          :key="item.value"
          class="language-chip pressable"
          :class="{ active: theme === item.value }"
          @tap="chooseTheme(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('musicTitle') }}</text>
      <text class="muted">{{ music.enabled ? $t('musicEnabled') : $t('musicDisabled') }}</text>
    </view>

    <view class="setting-card glass-card">
      <view class="music-head">
        <view class="setting-copy">
          <text class="setting-title">{{ $t('musicTitle') }}</text>
          <text class="setting-desc">{{ $t('musicDesc') }}</text>
        </view>
        <switch :checked="music.enabled" color="#22d3ee" @change="toggleMusic" />
      </view>

      <view class="track-block">
        <text class="track-label">{{ $t('musicTrack') }}</text>
        <text class="track-name">{{ music.track.name }}</text>
        <text class="track-artist">{{ $t('musicArtist') }}：{{ music.track.artist }}</text>
      </view>

      <view class="volume-row">
        <text class="volume-label">{{ $t('musicVolume') }}</text>
        <slider
          class="volume-slider"
          :value="Math.round(music.volume * 100)"
          min="0"
          max="100"
          block-size="16"
          activeColor="#22d3ee"
          backgroundColor="rgba(255,255,255,0.12)"
          @changing="changeVolume"
          @change="changeVolume"
        />
        <text class="volume-value">{{ Math.round(music.volume * 100) }}%</text>
      </view>
    </view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { getLanguage, languageOptions, setLanguage } from '@/common/i18n.js'
import { getTheme, setTheme, themeOptions } from '@/common/theme.js'
import { getMusicState, setMusicEnabled, setMusicVolume, toggleMusic } from '@/common/music.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      languageOptions,
      themeOptions,
      language: getLanguage(),
      theme: getTheme(),
      music: getMusicState()
    }
  },
  computed: {
    currentLanguageLabel() {
      const item = this.languageOptions.find(option => option.value === this.language)
      return item ? item.label : ''
    },
    currentThemeLabel() {
      const item = this.themeOptions.find(option => option.value === this.theme)
      return item ? item.label : ''
    }
  },
  onShow() {
    this.language = getLanguage()
    this.theme = getTheme()
    this.music = getMusicState()
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    },
    chooseLanguage(lang) {
      this.language = setLanguage(lang)
      uni.showToast({ title: this.$t('settingsSaved'), icon: 'none' })
    },
    chooseTheme(theme) {
      this.theme = setTheme(theme)
      uni.showToast({ title: this.$t('themeSaved'), icon: 'none' })
    },
    toggleMusic() {
      this.music = toggleMusic()
      uni.showToast({ title: this.music.enabled ? this.$t('musicEnabled') : this.$t('musicDisabled'), icon: 'none' })
    },
    changeVolume(event) {
      const value = Array.isArray(event.detail.value) ? event.detail.value[0] : event.detail.value
      this.music = setMusicVolume(Number(value) / 100)
      if (!this.music.enabled && this.music.volume > 0) {
        // keep stored volume only
        setMusicEnabled(false)
      }
    }
  }
}
</script>

<style scoped>
.simple-page {
  padding-bottom: 54rpx;
}

.card,
.setting-card {
  padding: 24rpx;
}

.title {
  color: var(--app-title);
  font-size: 37.4rpx;
  font-weight: 900;
}

.desc {
  margin-top: 14rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
  line-height: 41.8rpx;
}

.setting-card + .setting-card {
  margin-top: 14rpx;
}

.setting-copy {
  min-width: 0;
}

.setting-title {
  color: var(--app-title);
  font-size: 31.9rpx;
  font-weight: 900;
}

.setting-desc {
  margin-top: 10rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
  line-height: 39.6rpx;
}

.language-options {
  margin-top: 22rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.theme-options {
  margin-top: 22rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.language-chip {
  height: 70rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-chip-text);
  font-size: 27.5rpx;
  border: 1rpx solid var(--app-border);
  background: var(--app-muted-panel);
}

.language-chip.active {
  color: #08111f;
  font-weight: 900;
  background: #22d3ee;
  border-color: #22d3ee;
}

.music-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.track-block {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 8rpx;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.track-label {
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 800;
}

.track-name {
  margin-top: 8rpx;
  display: block;
  color: var(--app-title);
  font-size: 30.8rpx;
  font-weight: 900;
}

.track-artist {
  margin-top: 8rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
}

.volume-row {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: 78rpx 1fr 70rpx;
  align-items: center;
  gap: 12rpx;
}

.volume-label,
.volume-value {
  color: var(--app-chip-text);
  font-size: 24.2rpx;
}

.volume-slider {
  width: 100%;
}
</style>
