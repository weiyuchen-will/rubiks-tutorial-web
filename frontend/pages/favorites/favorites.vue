<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleFavorites') }}</text>
      <view class="icon-btn">□</view>
    </view>
    <view class="glass-card card">
      <text class="title">{{ $t('titleFavorites') }}</text>
      <text class="desc">{{ $t('commonMockDesc') }}</text>
    </view>
    <KafangAssistant message="收藏的教程我先替你守着，复盘时从这里开转。" mood="cocky" tone="purple" />
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
