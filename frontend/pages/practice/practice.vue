<template>
  <view class="page-shell page-with-tab">
    <view class="top-bar">
      <text class="top-title">{{ $t('titlePractice') }}</text>
      <view class="icon-btn">⌁</view>
    </view>

    <scroll-view scroll-x class="cube-scroll" :show-scrollbar="false">
      <view class="cube-row">
        <view v-for="item in cubeTypes" :key="item" class="chip pressable" :class="{ active: cubeType === item }" @tap="selectCube(item)">{{ item }}</view>
      </view>
    </scroll-view>

    <KafangAssistant :message="assistantMessage" :mood="assistantMood" :tone="assistantTone" voice-pack="practice" />

    <view class="scramble-card glass-card">
      <view class="scramble-head">
        <text class="scramble-title">打乱公式</text>
        <text class="refresh pressable" @tap="refreshScramble">刷新</text>
      </view>
      <text class="scramble mono">{{ scramble }}</text>
    </view>

    <view class="timer-card glass-card" :class="{ running: status === '计时中' }">
      <text class="timer mono">{{ displayTime }}</text>
      <text class="timer-status">{{ status }}{{ solverMode ? ` · ${solverModeText}` : '' }}</text>
      <view class="timer-actions">
        <view class="timer-btn start pressable" @tap="startTimer">开始</view>
        <view class="timer-btn stop pressable" @tap="stopTimer">完成</view>
        <view class="timer-btn reset pressable" @tap="resetTimer">重置</view>
      </view>
      <view v-if="status === '计时中'" class="abandon-practice pressable" @tap="abandonPractice">放弃本次</view>
    </view>

    <view v-if="showModePicker" class="mode-mask">
      <view class="mode-dialog glass-card">
        <text class="mode-kicker">选择还原方式</text>
        <text class="mode-title">计时已开始，你要线上还是线下还原？</text>
        <view class="restore-options">
          <view class="restore-card pressable" @tap="chooseRestoreMode('online')">
            <text class="restore-name">线上还原</text>
            <text class="restore-desc">弹出虚拟魔方，点击公式控制转动，复原后自动完成。</text>
          </view>
          <view class="restore-card pressable" @tap="chooseRestoreMode('offline')">
            <text class="restore-name">线下还原</text>
            <text class="restore-desc">拿出实体魔方照常还原，完成后点击完成按钮。</text>
          </view>
        </view>
      </view>
    </view>

    <VirtualCubeSolve
      :visible="showVirtualCube"
      title="练习线上还原"
      subtitle="按高亮公式一步步转动虚拟魔方，复原后会自动记录本次成绩。"
      @solved="completePractice"
      @abandon="abandonPractice"
    />

    <view v-if="lastCompletion" class="completion-card glass-card">
      <view class="completion-main">
        <text class="completion-kicker">练习完成</text>
        <text class="completion-time mono">{{ lastCompletion.time }}</text>
        <text class="completion-copy">{{ completionCopy }}</text>
      </view>
      <view class="reward-strip">
        <view class="reward-item">
          <text class="reward-value">+{{ lastCompletion.points }}</text>
          <text class="reward-label">积分</text>
        </view>
        <view class="reward-item coin">
          <text class="reward-value">+{{ lastCompletion.coins }}</text>
          <text class="reward-label">金币</text>
        </view>
        <view class="reward-item streak" :class="{ pulse: lastCompletion.streakAdvanced }">
          <text class="reward-value">🔥 {{ lastCompletion.streak }}</text>
          <text class="reward-label">连续练习</text>
        </view>
      </view>
      <view class="completion-actions">
        <view class="result-btn ghost pressable" @tap="playAgain">再来一次</view>
        <view class="result-btn next pressable" @tap="goNextStep">下一步</view>
      </view>
    </view>

    <view class="stats-panel">
      <view v-for="item in stats" :key="item.label" class="small-stat glass-card">
        <text class="small-value">{{ item.value }}</text>
        <text class="small-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">练习入口</text>
    </view>
    <view class="entry-grid">
      <view v-for="entry in entries" :key="entry.title" class="entry-card glass-card card-press" @tap="go(entry.path)">
        <text class="entry-icon">{{ entry.icon }}</text>
        <text class="entry-title">{{ entry.title }}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">最近成绩</text>
    </view>
    <view class="solve-list glass-card">
      <view v-for="solve in solves" :key="solve.id" class="solve-row card-press" @tap="go(`/pages/solve-detail/solve-detail?id=${solve.id}`)">
        <text class="solve-rank">#{{ solve.rank }}</text>
        <text class="solve-time mono">{{ solve.time }}</text>
        <text class="solve-cube">{{ solve.cube }}</text>
        <text class="solve-date">{{ solve.date }}</text>
      </view>
    </view>

    <AppTabBar current="practice" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import VirtualCubeSolve from '@/components/VirtualCubeSolve/VirtualCubeSolve.vue'
import { getScramble, solves } from '@/common/mock.js'
import { getTodayPracticeState, getUserState, recordPracticeCompletion, updateUserState } from '@/common/userState.js'

export default {
  components: { AppTabBar, KafangAssistant, VirtualCubeSolve },
  data() {
    return {
      cubeTypes: ['2x2', '3x3', '4x4', '5x5'],
      cubeType: '3x3',
      scramble: '',
      elapsed: 22580,
      startAt: 0,
      timer: null,
      status: '准备',
      solverMode: '',
      showModePicker: false,
      showVirtualCube: false,
      todayPractice: getTodayPracticeState(),
      lastCompletion: null,
      solves,
      entries: [
        { title: '公式训练', icon: 'ƒ', path: '/pages/formula-trainer/formula-trainer' },
        { title: '白十字专项', icon: '+', path: '/pages/special-practice/special-practice?type=cross' },
        { title: 'F2L 专项', icon: 'F', path: '/pages/special-practice/special-practice?type=f2l' },
        { title: 'PLL 识别', icon: 'P', path: '/pages/special-practice/special-practice?type=pll' }
      ]
    }
  },
  computed: {
    displayTime() {
      const total = this.elapsed
      const minutes = Math.floor(total / 60000)
      const seconds = Math.floor((total % 60000) / 1000)
      const hundred = Math.floor((total % 1000) / 10)
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundred).padStart(2, '0')}`
    },
    stats() {
      return [
        { label: '最佳成绩', value: '24.82s' },
        { label: '最近一次', value: this.solves[0].time.replace('00:', '') },
        { label: 'Ao5', value: '27.48s' },
        { label: 'Ao12', value: '29.16s' },
        { label: '今日次数', value: String(this.todayPractice.sessions.length) }
      ]
    },
    solverModeText() {
      if (this.solverMode === 'online') return '线上还原'
      if (this.solverMode === 'offline') return '线下还原'
      return ''
    },
    assistantMood() {
      if (this.status === '已完成') return 'happy'
      if (this.status === '计时中') return 'nervous'
      return 'cocky'
    },
    assistantTone() {
      if (this.status === '已完成') return 'green'
      if (this.status === '计时中') return 'orange'
      return 'cyan'
    },
    assistantMessage() {
      if (this.status === '已完成') return '漂亮！还原完成，我先替你跳一下。'
      if (this.status === '计时中') return '稳住别慌，我在旁边咔咔给你计时。'
      return '先看清打乱公式，准备好了就开转。'
    },
    completionCopy() {
      if (!this.lastCompletion) return ''
      if (this.lastCompletion.streakAdvanced) return `今天第一次有效练习，连续练习涨到 ${this.lastCompletion.streak} 天。`
      return `今日训练场又长出 1 块，现在共有 ${this.todayPractice.sessions.length} 块。`
    }
  },
  onLoad() {
    this.refreshScramble()
  },
  onShow() {
    this.refreshPracticeState()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    refreshPracticeState() {
      this.todayPractice = getTodayPracticeState()
    },
    selectCube(item) {
      this.cubeType = item
      this.refreshScramble()
    },
    refreshScramble() {
      this.scramble = getScramble(this.cubeType)
    },
    startTimer() {
      if (this.timer) return
      this.status = '计时中'
      this.solverMode = ''
      this.showModePicker = true
      this.startAt = Date.now() - this.elapsed
      this.timer = setInterval(() => {
        this.elapsed = Date.now() - this.startAt
      }, 33)
    },
    chooseRestoreMode(mode) {
      this.solverMode = mode
      this.showModePicker = false
      this.showVirtualCube = mode === 'online'
    },
    stopTimer() {
      if (!this.timer) return
      this.completePractice()
    },
    completePractice() {
      if (!this.timer) return
      this.clearTimer()
      this.showModePicker = false
      this.showVirtualCube = false
      this.status = '已完成'
      const result = recordPracticeCompletion({
        id: `practice-${Date.now()}`,
        cube: this.cubeType,
        time: this.displayTime,
        elapsed: this.elapsed
      })
      this.refreshPracticeState()
      this.lastCompletion = {
        time: this.displayTime,
        points: result.points,
        coins: result.coins,
        streak: result.streak,
        streakAdvanced: result.streakAdvanced
      }
    },
    abandonPractice() {
      if (!this.timer && !this.showModePicker && !this.showVirtualCube) return
      uni.showModal({
        title: '放弃练习',
        content: '确认放弃本次计时吗？会扣除 6 积分。',
        confirmColor: '#ef4444',
        success: res => {
          if (!res.confirm) return
          const user = getUserState()
          updateUserState({ points: Math.max(0, (user.points || 0) - 6) })
          this.clearTimer()
          this.showModePicker = false
          this.showVirtualCube = false
          this.status = '已放弃'
          this.solverMode = ''
          uni.showToast({ title: '已放弃，-6 积分', icon: 'none' })
        }
      })
    },
    resetTimer() {
      this.clearTimer()
      this.elapsed = 0
      this.status = '准备'
      this.solverMode = ''
      this.showModePicker = false
      this.showVirtualCube = false
      this.lastCompletion = null
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    go(path) {
      uni.navigateTo({ url: path })
    },
    playAgain() {
      this.resetTimer()
      this.refreshScramble()
    },
    goNextStep() {
      uni.navigateTo({ url: '/pages/tutorial-detail/tutorial-detail?id=t2' })
    }
  }
}
</script>

<style scoped>
.cube-row {
  width: max-content;
  padding: 0 0 20rpx;
  display: flex;
  gap: 14rpx;
}

.scramble-card {
  padding: 24rpx;
}

.scramble-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scramble-title {
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 800;
}

.refresh {
  color: #22d3ee;
  font-size: 26.4rpx;
}

.scramble {
  margin-top: 18rpx;
  display: block;
  color: var(--app-title);
  font-size: 31.9rpx;
  line-height: 48.4rpx;
  word-break: break-word;
}

.timer-card {
  margin-top: 22rpx;
  padding: 44rpx 24rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-card.running {
  box-shadow: 0 0 42rpx rgba(34, 197, 94, 0.2);
}

.timer {
  color: var(--app-title);
  font-size: 90.2rpx;
  font-weight: 900;
  line-height: 105.6rpx;
}

.timer-status {
  margin-top: 8rpx;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
}

.timer-actions {
  width: 100%;
  margin-top: 32rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.timer-btn {
  height: 74rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 29.7rpx;
  font-weight: 900;
}

.start {
  background: #22c55e;
}

.stop {
  background: #ef4444;
}

.reset {
  color: var(--app-chip-text);
  border: 1rpx solid var(--app-border);
}

.abandon-practice {
  width: 100%;
  height: 64rpx;
  margin-top: 14rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fecaca;
  font-size: 26.4rpx;
  font-weight: 900;
  background: rgba(239, 68, 68, 0.14);
  border: 1rpx solid rgba(239, 68, 68, 0.28);
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

.completion-card {
  margin-top: 18rpx;
  padding: 24rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 90% 12%, rgba(250, 204, 21, 0.16), transparent 28%),
    var(--app-surface);
}

.completion-main {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.completion-kicker {
  color: #22c55e;
  font-size: 24.2rpx;
  font-weight: 900;
}

.completion-time {
  color: var(--app-title);
  font-size: 52.8rpx;
  line-height: 63.8rpx;
  font-weight: 900;
}

.completion-copy {
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
  line-height: 37.4rpx;
}

.reward-strip {
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}

.reward-item {
  min-width: 0;
  height: 86rpx;
  padding: 10rpx 6rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  background: rgba(34, 197, 94, 0.14);
  border: 1rpx solid rgba(34, 197, 94, 0.28);
}

.reward-item.coin {
  background: rgba(250, 204, 21, 0.15);
  border-color: rgba(250, 204, 21, 0.32);
}

.reward-item.streak {
  background: rgba(251, 146, 60, 0.16);
  border-color: rgba(251, 146, 60, 0.34);
}

.reward-item.pulse {
  animation: streakPulse 0.9s ease-in-out infinite alternate;
}

.reward-value {
  max-width: 100%;
  overflow: hidden;
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.reward-label {
  color: var(--app-text-secondary);
  font-size: 19.8rpx;
}

.completion-actions {
  margin-top: 22rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.result-btn {
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27.5rpx;
  font-weight: 900;
}

.result-btn.ghost {
  color: var(--app-title);
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.result-btn.next {
  color: #020617;
  background: #22d3ee;
}

@keyframes streakPulse {
  from {
    box-shadow: 0 0 0 rgba(251, 146, 60, 0);
    transform: translateY(0);
  }
  to {
    box-shadow: 0 0 22rpx rgba(251, 146, 60, 0.28);
    transform: translateY(-2rpx);
  }
}

.stats-panel {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10rpx;
}

.small-stat {
  min-width: 0;
  padding: 18rpx 4rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.small-value {
  max-width: 100%;
  overflow: hidden;
  color: var(--app-title);
  font-size: 24.2rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.small-label {
  color: var(--app-text-secondary);
  font-size: 20.9rpx;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.entry-card {
  height: 118rpx;
  padding: 18rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.entry-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 30.8rpx;
  font-weight: 900;
  background: #22d3ee;
}

.entry-title {
  min-width: 0;
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 800;
}

.solve-list {
  padding: 6rpx 16rpx;
}

.solve-row {
  height: 72rpx;
  display: grid;
  grid-template-columns: 72rpx 1fr 74rpx 144rpx;
  align-items: center;
  gap: 8rpx;
  border-bottom: 1rpx solid var(--app-border);
}

.solve-row:last-child {
  border-bottom: 0;
}

.solve-rank {
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}

.solve-time {
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 800;
}

.solve-cube,
.solve-date {
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
}
</style>
