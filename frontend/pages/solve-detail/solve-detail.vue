<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">成绩详情</text>
      <view class="icon-btn">秒</view>
    </view>
    <view class="glass-card card">
      <text class="time mono">{{ solve.time }}</text>
      <text class="meta">{{ solve.cube }} · {{ solve.date }}</text>
      <text class="desc">打乱公式、分段耗时和复盘笔记可在这里扩展。</text>
    </view>
    <KafangAssistant :message="`这次 ${solve.time}，复盘一遍，比盲目再来十把更值。`" mood="cocky" tone="green" voice-pack="practice" />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { solves } from '@/common/mock.js'
export default {
  components: { KafangAssistant },
  data() {
    return { id: 's1' }
  },
  computed: {
    solve() {
      return solves.find(item => item.id === this.id) || solves[0]
    }
  },
  onLoad(query) {
    this.id = query.id || 's1'
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
  padding: 32rpx;
}
.time {
  color: var(--app-title);
  font-size: 70.4rpx;
  font-weight: 900;
}
.meta,
.desc {
  margin-top: 16rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
  line-height: 41.8rpx;
}
</style>
