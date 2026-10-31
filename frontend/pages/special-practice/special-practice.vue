<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">专项练习</text>
      <view class="icon-btn">练</view>
    </view>
    <view class="glass-card card">
      <text class="title">{{ title }}</text>
      <text class="desc">本地 mock 专项训练入口，后续可接入题库、计时和错题统计。</text>
      <view class="btn pressable" @tap="back">返回练习</view>
    </view>
    <KafangAssistant :message="assistantMessage" mood="go" tone="green" voice-pack="practice" />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'

export default {
  components: { KafangAssistant },
  data() {
    return { type: 'cross' }
  },
  computed: {
    title() {
      const map = { cross: '白十字专项', f2l: 'F2L 专项', pll: 'PLL 识别' }
      return map[this.type] || '专项练习'
    },
    assistantMessage() {
      const map = {
        cross: '白十字别求快，先让四条边站对队。',
        f2l: 'F2L 先看配对，再一口气塞进去。',
        pll: 'PLL 识别要靠眼熟，我陪你刷到条件反射。'
      }
      return map[this.type] || '专项练习开了，今天只盯一个弱点。'
    }
  },
  onLoad(query) {
    this.type = query.type || 'cross'
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/practice/practice' })
    }
  }
}
</script>

<style scoped>
.simple-page {
  padding-bottom: 54rpx;
}
.card {
  padding: 28rpx;
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
.btn {
  height: 72rpx;
  margin-top: 28rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-weight: 900;
  background: #22d3ee;
}
</style>
