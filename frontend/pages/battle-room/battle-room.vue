<template>
  <view class="room-page">
    <view class="top-bar room-top">
      <view class="icon-btn pressable" @tap="confirmExit">‹</view>
      <text class="top-title">对战中</text>
      <view class="exit pressable" @tap="confirmExit">退出</view>
    </view>

    <view class="versus glass-card">
      <view class="side">
        <view class="avatar-wrap" :style="{ background: avatarFrameGradient }">
          <image v-if="user.avatarImage" class="avatar-image" :src="user.avatarImage" mode="aspectFill" />
          <view v-else class="avatar-face" :style="{ background: avatarGradient }">
            <text>{{ avatarOption.icon }}</text>
          </view>
        </view>
        <text class="side-name ellipsis">{{ user.name }}</text>
        <text class="points">{{ user.points }}</text>
      </view>
      <view class="vs">VS</view>
      <view class="side">
        <view class="bot-avatar">{{ bot.name.slice(0, 1) }}</view>
        <text class="side-name ellipsis">{{ bot.name }}</text>
        <text class="points">{{ bot.points }}</text>
      </view>
    </view>

    <view class="countdown" :class="{ go: countText === 'GO' }">{{ countText }}</view>

    <view class="scramble glass-card">
      <text class="scramble-label">{{ cubeType }} 本局打乱</text>
      <text class="scramble-text mono">{{ scramble }}</text>
    </view>

    <view class="timer-panel glass-card">
      <text class="timer mono">{{ displayTime }}</text>
      <text class="muted">{{ timerHint }}</text>
      <view class="ai-progress">
        <view class="ai-fill" :style="{ width: aiProgress + '%' }" />
      </view>
      <text class="ai-label">AI 进度 {{ aiProgress }}%</text>
    </view>

    <view v-if="showModePicker" class="mode-mask">
      <view class="mode-dialog glass-card">
        <text class="mode-kicker">选择还原方式</text>
        <text class="mode-title">先选线上或线下，GO 后双方同时开始计时。</text>
        <view class="restore-options">
          <view class="restore-card pressable" @tap="chooseRestoreMode('online')">
            <text class="restore-name">线上还原</text>
            <text class="restore-desc">桌面弹出虚拟魔方，点击公式转动，复原后自动完成本局。</text>
          </view>
          <view class="restore-card pressable" @tap="chooseRestoreMode('offline')">
            <text class="restore-name">线下还原</text>
            <text class="restore-desc">使用实体魔方还原，完成后点击下方完成按钮。</text>
          </view>
        </view>
      </view>
    </view>

    <KafangAssistant :message="roomAssistantMessage" :mood="running ? 'nervous' : 'go'" tone="orange" voice-pack="battle" />

    <view class="finish-btn pressable" :class="{ disabled: !running || solverMode === 'online' }" @tap="finish(false)">完成还原</view>

    <VirtualCubeSolve
      :visible="showVirtualCube"
      title="对战线上还原"
      subtitle="按高亮公式控制虚拟魔方。复原会立刻停止计时并进入本局结算。"
      @solved="finish(true)"
      @abandon="confirmExit"
    />
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import VirtualCubeSolve from '@/components/VirtualCubeSolve/VirtualCubeSolve.vue'
import { bots, getScramble } from '@/common/mock.js'
import { getAvatarOption, getEquippedFrame, getUserState } from '@/common/userState.js'

export default {
  components: { KafangAssistant, VirtualCubeSolve },
  data() {
    return {
      user: getUserState(),
      botId: 'b1',
      cubeType: '3x3',
      scramble: '',
      countText: 'READY',
      running: false,
      elapsed: 0,
      aiProgress: 0,
      timer: null,
      aiFinishTimer: null,
      countdownTimer: null,
      startAt: 0,
      aiTargetMs: 0,
      solverMode: '',
      showModePicker: true,
      showVirtualCube: false,
      matchEnded: false
    }
  },
  computed: {
    bot() {
      return bots.find(item => item.id === this.botId) || bots[0]
    },
    avatarOption() {
      return getAvatarOption(this.user.avatarOption)
    },
    avatarGradient() {
      return `linear-gradient(135deg, ${this.avatarOption.colors[0]}, ${this.avatarOption.colors[1]})`
    },
    avatarFrameGradient() {
      const frame = getEquippedFrame(this.user)
      return `conic-gradient(${frame.color}, #fff, ${frame.color}, #f97316, ${frame.color})`
    },
    displayTime() {
      const total = this.elapsed
      const minutes = Math.floor(total / 60000)
      const seconds = Math.floor((total % 60000) / 1000)
      const hundred = Math.floor((total % 1000) / 10)
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundred).padStart(2, '0')}`
    },
    solverModeText() {
      if (this.solverMode === 'online') return '线上还原'
      if (this.solverMode === 'offline') return '线下还原'
      return ''
    },
    timerHint() {
      if (this.running) return `计时中 · ${this.solverModeText}`
      if (this.solverMode) return `等待倒计时 · ${this.solverModeText}`
      return '选择还原方式后开始计时'
    },
    roomAssistantMessage() {
      if (this.running && this.solverMode === 'online') return '线上魔方开好了，按高亮公式推进，复原会自动交卷。'
      if (this.running) return '别看我，我也紧张！复原完成就拍按钮。'
      if (this.countText === 'GO') return 'GO！我先跳一下，你快转。'
      if (!this.solverMode) return '先选线上还原或线下还原，选完我再喊倒计时。'
      return `倒计时 ${this.countText}，手放稳，别抢跑。`
    }
  },
  onLoad(query) {
    this.botId = query.botId || 'b1'
    this.cubeType = query.cubeType || '3x3'
    this.scramble = getScramble(this.cubeType)
  },
  onShow() {
    this.checkAiFinish()
  },
  onUnload() {
    this.clearAll()
  },
  methods: {
    startCountdown() {
      const seq = ['3', '2', '1', 'GO']
      let idx = 0
      this.countText = seq[idx]
      this.countdownTimer = setInterval(() => {
        idx += 1
        if (idx >= seq.length) {
          clearInterval(this.countdownTimer)
          this.startTimer()
          return
        }
        this.countText = seq[idx]
      }, 900)
    },
    startTimer() {
      this.running = true
      this.startAt = Date.now()
      this.aiTargetMs = this.getAiSeconds() * 1000
      this.showVirtualCube = this.solverMode === 'online'
      this.aiFinishTimer = setTimeout(() => {
        this.elapsed = Math.max(this.elapsed, this.aiTargetMs)
        this.aiProgress = 100
        this.completeBattle('lose')
      }, this.aiTargetMs)
      this.timer = setInterval(() => {
        this.elapsed = Date.now() - this.startAt
        this.aiProgress = Math.min(99, Math.floor((this.elapsed / this.aiTargetMs) * 100))
        this.checkAiFinish()
      }, 60)
    },
    checkAiFinish() {
      if (!this.running || this.matchEnded || !this.aiTargetMs) return
      this.elapsed = Date.now() - this.startAt
      if (this.elapsed < this.aiTargetMs) return
      this.elapsed = Math.max(this.elapsed, this.aiTargetMs)
      this.aiProgress = 100
      this.completeBattle('lose')
    },
    chooseRestoreMode(mode) {
      if (this.running || this.countdownTimer) return
      this.solverMode = mode
      this.showModePicker = false
      this.showVirtualCube = false
      this.startCountdown()
    },
    finish(force = false) {
      if (!this.running || this.matchEnded) return
      if (this.solverMode === 'online' && !force) return
      const aiSeconds = this.getAiSeconds()
      const playerSeconds = this.elapsed / 1000
      const result = playerSeconds <= aiSeconds ? 'win' : 'lose'
      this.completeBattle(result)
    },
    getAiSeconds() {
      return this.bot.id === 'b3' ? 24.8 : this.bot.id === 'b2' ? 36.6 : 62.4
    },
    completeBattle(result) {
      if (this.matchEnded) return
      this.matchEnded = true
      const player = this.displayTime
      const aiSeconds = this.getAiSeconds()
      this.clearAll()
      const battleId = `battle-${Date.now()}`
      uni.redirectTo({ url: `/pages/battle-result/battle-result?battleId=${battleId}&player=${player}&ai=${aiSeconds.toFixed(2)}s&result=${result}` })
    },
    confirmExit() {
      uni.showModal({
        title: '退出对战',
        content: '确认放弃本局对战吗？放弃会扣除积分。',
        confirmColor: '#ef4444',
        success: res => {
          if (!res.confirm) return
          const battleId = `battle-${Date.now()}`
          const player = this.displayTime
          const aiSeconds = this.getAiSeconds()
          this.matchEnded = true
          this.clearAll()
          uni.redirectTo({ url: `/pages/battle-result/battle-result?battleId=${battleId}&player=${player}&ai=${aiSeconds.toFixed(2)}s&result=abandon` })
        }
      })
    },
    clearAll() {
      if (this.timer) clearInterval(this.timer)
      if (this.aiFinishTimer) clearTimeout(this.aiFinishTimer)
      if (this.countdownTimer) clearInterval(this.countdownTimer)
      this.timer = null
      this.aiFinishTimer = null
      this.countdownTimer = null
      this.aiTargetMs = 0
      this.running = false
      this.showModePicker = false
      this.showVirtualCube = false
    }
  }
}
</script>

<style scoped>
.room-page {
  min-height: 100vh;
  padding: 0 24rpx 54rpx;
  color: var(--app-text-primary);
  background:
    radial-gradient(circle at 50% 4%, rgba(239, 68, 68, 0.16), transparent 34%),
    radial-gradient(circle at 20% 78%, rgba(34, 211, 238, 0.16), transparent 34%),
    var(--app-page-bg);
}

.exit {
  height: 56rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  color: var(--app-chip-text);
  font-size: 26.4rpx;
  background: var(--app-muted-panel);
}

.versus {
  padding: 26rpx 20rpx;
  display: grid;
  grid-template-columns: 1fr 96rpx 1fr;
  align-items: center;
}

.side {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.avatar,
.bot-avatar {
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
}

.avatar-wrap {
  width: 86rpx;
  height: 86rpx;
  padding: 5rpx;
  border-radius: 50%;
}

.avatar-face {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26.4rpx;
  font-weight: 900;
}

.avatar-image {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
}

.bot-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-weight: 900;
  background: linear-gradient(135deg, #22d3ee, #f97316);
}

.side-name {
  max-width: 100%;
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 800;
}

.points {
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
}

.vs {
  color: #ef4444;
  text-align: center;
  font-size: 37.4rpx;
  font-weight: 900;
}

.countdown {
  height: 190rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-title);
  font-size: 118.8rpx;
  font-weight: 900;
  animation: pop 0.9s infinite;
}

.countdown.go {
  color: #22c55e;
}

.scramble {
  padding: 22rpx;
}

.scramble-label {
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 800;
}

.scramble-text {
  margin-top: 12rpx;
  display: block;
  color: var(--app-title);
  font-size: 30.8rpx;
  line-height: 46.2rpx;
  word-break: break-word;
}

.timer-panel {
  margin-top: 22rpx;
  padding: 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer {
  color: var(--app-title);
  font-size: 85.8rpx;
  font-weight: 900;
}

.ai-progress {
  width: 100%;
  height: 12rpx;
  margin-top: 34rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: var(--app-muted-panel);
}

.ai-fill {
  height: 100%;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #f97316, #ef4444);
}

.ai-label {
  margin-top: 12rpx;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
}

.mode-mask {
  position: fixed;
  z-index: 25;
  inset: 0;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  background: rgba(2, 6, 23, 0.68);
}

.mode-dialog {
  width: 100%;
  padding: 26rpx;
  background: var(--app-surface-strong);
}

.mode-kicker {
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 900;
}

.mode-title {
  margin-top: 8rpx;
  display: block;
  color: var(--app-title);
  font-size: 35.2rpx;
  line-height: 46.2rpx;
  font-weight: 900;
}

.restore-options {
  margin-top: 22rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.restore-card {
  min-width: 0;
  min-height: 154rpx;
  padding: 18rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.restore-name {
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 900;
}

.restore-desc {
  color: var(--app-text-secondary);
  font-size: 23.1rpx;
  line-height: 31.9rpx;
}

.finish-btn {
  height: 92rpx;
  margin-top: 28rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 34.1rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
}

.finish-btn.disabled {
  opacity: 0.48;
}

@keyframes pop {
  0% {
    transform: scale(0.84);
    opacity: 0.6;
  }
  45% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.75;
  }
}
</style>
