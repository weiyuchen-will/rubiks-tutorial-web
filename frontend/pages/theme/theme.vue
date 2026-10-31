<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleTheme') }}</text>
      <view class="icon-btn">□</view>
    </view>
    <view class="glass-card card">
      <text class="title">{{ $t('themeTitle') }}</text>
      <text class="desc">{{ $t('themeDesc') }}</text>
      <view class="theme-grid">
        <view
          v-for="item in themeOptions"
          :key="item.value"
          class="theme-choice pressable"
          :class="{ active: theme === item.value, light: item.value === 'light' }"
          @tap="chooseTheme(item.value)"
        >
          <view class="theme-preview">
            <view class="preview-bar" />
            <view class="preview-card" />
            <view class="preview-line short" />
            <view class="preview-line" />
          </view>
          <text class="choice-label">{{ item.label }}</text>
        </view>
      </view>
    </view>
    <KafangAssistant :message="theme === 'light' ? '浅色模式开了，白天练习眼睛轻松点。' : '深色模式开了，竞技场气氛拉满。'" :mood="theme === 'light' ? 'happy' : 'cocky'" tone="purple" voice-pack="settings" />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { getTheme, setTheme, themeOptions } from '@/common/theme.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      themeOptions,
      theme: getTheme()
    }
  },
  onShow() {
    this.theme = getTheme()
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    },
    chooseTheme(theme) {
      this.theme = setTheme(theme)
      uni.showToast({ title: this.$t('themeSaved'), icon: 'none' })
    }
  }
}
</script>

<style scoped>
.simple-page { padding-bottom: 54rpx; }
.card { padding: 28rpx; }
.title { color: var(--app-title); font-size: 37.4rpx; font-weight: 900; }
.desc { margin-top: 14rpx; display: block; color: var(--app-text-secondary); font-size: 27.5rpx; line-height: 41.8rpx; }
.theme-grid {
  margin-top: 28rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
}
.theme-choice {
  padding: 14rpx;
  border-radius: 8rpx;
  border: 1rpx solid var(--app-border);
  background: var(--app-muted-panel);
}
.theme-choice.active {
  border-color: #22d3ee;
  box-shadow: 0 0 0 3rpx rgba(34, 211, 238, 0.16);
}
.theme-preview {
  height: 146rpx;
  padding: 14rpx;
  border-radius: 8rpx;
  background: linear-gradient(180deg, #020617, #0f172a);
}
.theme-choice.light .theme-preview {
  background: linear-gradient(180deg, #f8fbff, #eaf3ff);
}
.preview-bar {
  width: 62%;
  height: 16rpx;
  border-radius: 8rpx;
  background: #22d3ee;
}
.preview-card {
  height: 46rpx;
  margin-top: 16rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.16);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
}
.theme-choice.light .preview-card {
  background: rgba(15, 23, 42, 0.08);
  border-color: rgba(15, 23, 42, 0.08);
}
.preview-line {
  height: 10rpx;
  margin-top: 10rpx;
  border-radius: 8rpx;
  background: rgba(148, 163, 184, 0.5);
}
.preview-line.short {
  width: 68%;
}
.choice-label {
  margin-top: 12rpx;
  display: block;
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 900;
  text-align: center;
}
</style>
