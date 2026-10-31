<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleMistakes') }}</text>
      <view class="icon-btn">□</view>
    </view>
    <view class="glass-card card">
      <text class="title">{{ $t('titleMistakes') }}</text>
      <text class="desc">{{ $t('commonMockDesc') }}</text>
    </view>
    <KafangAssistant message="错题不是丢脸，是我给你抓到的提速入口。" mood="nervous" tone="orange" />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'

export default {
  components: { KafangAssistant },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    }
  }
}
</script>

<style scoped>
.simple-page { padding-bottom: 54rpx; }
.card { padding: 28rpx; }
.title { color: var(--app-title); font-size: 37.4rpx; font-weight: 900; }
.desc { margin-top: 14rpx; display: block; color: var(--app-text-secondary); font-size: 27.5rpx; line-height: 41.8rpx; }
</style>
