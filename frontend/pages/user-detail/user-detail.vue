<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">玩家主页</text>
      <view class="icon-btn">人</view>
    </view>
    <view class="glass-card card">
      <image class="avatar" :src="player.avatar" />
      <text class="name">{{ player.name }}</text>
      <text class="meta">Lv.{{ player.level }} · {{ player.value }} 积分</text>
    </view>
    <KafangAssistant :message="`${player.name} 这成绩有点东西，咱们拿它当追赶目标。`" mood="go" tone="orange" voice-pack="cheer" />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { rankingUsers } from '@/common/mock.js'
export default {
  components: { KafangAssistant },
  data() {
    return { userId: 'u1' }
  },
  computed: {
    player() {
      return rankingUsers.find(item => item.id === this.userId) || rankingUsers[0]
    }
  },
  onLoad(query) {
    this.userId = query.userId || 'u1'
  },
  methods: {
    back() {
      uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/rankings/rankings' }) })
    }
  }
}
</script>

<style scoped>
.simple-page {
  padding-bottom: 54rpx;
}
.card {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
.name {
  margin-top: 18rpx;
  color: var(--app-title);
  font-size: 37.4rpx;
  font-weight: 900;
}
.meta {
  margin-top: 10rpx;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
}
</style>
