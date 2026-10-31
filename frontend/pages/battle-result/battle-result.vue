<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="goBattle">‹</view>
      <text class="top-title">对战结果</text>
      <view class="icon-btn pressable" @tap="goHome">✓</view>
    </view>
    <view class="result-card glass-card">
      <KafangMascot class="result-mascot" :mood="result === 'win' ? 'happy' : 'nervous'" size="medium" show-name />
      <text class="result-title" :class="{ win: result === 'win', lose: result !== 'win' }">{{ resultTitle }}</text>
      <text class="result-tip">{{ resultTip }}</text>
      <text class="result-sub">玩家 {{ player || '00:29.42' }} · AI {{ ai || '36.60s' }}</text>
      <view v-if="reward.rewarded" class="reward-row">
        <text :class="{ penalty: reward.points < 0 }">{{ signed(reward.points) }} 积分</text>
        <text v-if="reward.coins" :class="{ penalty: reward.coins < 0 }">{{ signed(reward.coins) }} 金币</text>
      </view>
      <view class="btn pressable" @tap="goBattle">返回对战</view>
    </view>
  </view>
</template>

<script>
import KafangMascot from '@/components/KafangMascot/KafangMascot.vue'
import { applyBattleReward } from '@/common/userState.js'

export default {
  components: { KafangMascot },
  data() {
    return { result: 'win', player: '', ai: '', battleId: '', reward: { rewarded: false, points: 0, coins: 0 } }
  },
  onLoad(query) {
    this.result = query.result || 'win'
    this.player = query.player || ''
    this.ai = query.ai || ''
    this.battleId = query.battleId || ''
    const reward = applyBattleReward(this.battleId, this.result)
    this.reward = { rewarded: reward.rewarded, points: reward.points, coins: reward.coins }
  },
  computed: {
    resultTitle() {
      if (this.result === 'win') return '胜利'
      if (this.result === 'abandon') return '已放弃'
      return '惜败'
    },
    resultTip() {
      if (this.result === 'win') return '咔！赢了，我已经跳起来了。'
      if (this.result === 'abandon') return '本局已放弃，积分扣掉一点点，下一局再追。'
      return '差一点，下局我帮你盯紧。'
    }
  },
  methods: {
    signed(value) {
      return value > 0 ? `+${value}` : String(value)
    },
    goBattle() {
      uni.redirectTo({ url: '/pages/battle/battle' })
    },
    goHome() {
      uni.redirectTo({ url: '/pages/home/home' })
    }
  }
}
</script>

<style scoped>
.simple-page {
  padding-bottom: 54rpx;
}
.result-card {
  margin-top: 70rpx;
  padding: 46rpx 26rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-mascot {
  margin-bottom: 18rpx;
}
.result-title {
  font-size: 70.4rpx;
  font-weight: 900;
}
.win {
  color: #22c55e;
}
.lose {
  color: #ef4444;
}
.result-tip {
  margin-top: 8rpx;
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 900;
}
.result-sub {
  margin-top: 18rpx;
  color: var(--app-text-secondary);
  font-size: 28.6rpx;
}
.reward-row {
  margin-top: 20rpx;
  display: flex;
  gap: 14rpx;
}
.reward-row text {
  height: 48rpx;
  padding: 0 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  color: #020617;
  font-size: 25.3rpx;
  font-weight: 900;
  background: #facc15;
}
.reward-row text.penalty {
  color: #fff;
  background: #ef4444;
}
.btn {
  width: 220rpx;
  height: 70rpx;
  margin-top: 34rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-weight: 900;
  background: #22d3ee;
}
</style>
