<template>
  <view class="page-shell trainer-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="goBack">‹</view>
      <text class="top-title">公式训练</text>
      <view class="icon-btn">ƒ</view>
    </view>

    <view class="segment">
      <view v-for="item in categories" :key="item.key" class="segment-item pressable" :class="{ active: category === item.key }" @tap="switchCategory(item.key)">{{ item.label }}</view>
    </view>

    <KafangAssistant :message="trainerAssistantMessage" :mood="trainerMood" :tone="trainerTone" voice-pack="lesson" />

    <view class="question-card glass-card" :key="current.id">
      <text class="formula-name">{{ current.name }}</text>
      <text class="scene">{{ current.scene }}</text>
      <view class="cube-board">
        <view v-for="(color, idx) in boardColors" :key="idx" class="cube-piece" :style="{ background: color }" />
      </view>
      <view v-if="answerVisible" class="answer">
        <text class="answer-label">答案公式</text>
        <text class="answer-text mono">{{ current.alg }}</text>
        <text class="answer-cn">{{ current.cn }}</text>
      </view>
      <view v-else class="show-btn pressable" @tap="answerVisible = true">显示答案</view>
    </view>

    <view class="action-grid">
      <view class="action known pressable" @tap="markKnown">认识</view>
      <view class="action weak pressable" @tap="markWeak">不熟</view>
      <view class="action next pressable" @tap="nextQuestion">下一题</view>
      <view class="action mistake pressable" @tap="addMistake">加入错题本</view>
    </view>

    <view class="section-head">
      <text class="section-title">熟练度统计</text>
    </view>
    <view class="stats-grid">
      <view v-for="item in stats" :key="item.label" class="stat-card glass-card">
        <text class="stat-value">{{ item.value }}</text>
        <text class="stat-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { cubeColors, formulas } from '@/common/mock.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      categories: [
        { key: 'basic', label: '基础' },
        { key: 'f2l', label: 'F2L' },
        { key: 'oll', label: 'OLL' },
        { key: 'pll', label: 'PLL' }
      ],
      category: 'basic',
      index: 0,
      answerVisible: false,
      knownCount: 8,
      wrongCount: 3,
      streak: 4,
      lastAction: ''
    }
  },
  computed: {
    pool() {
      return formulas[this.category]
    },
    current() {
      return this.pool[this.index] || this.pool[0]
    },
    boardColors() {
      return cubeColors.concat(cubeColors).slice(0, 16)
    },
    stats() {
      return [
        { label: '今日训练', value: '18' },
        { label: '已掌握', value: this.knownCount },
        { label: '错题数量', value: this.wrongCount },
        { label: '连续正确', value: this.streak }
      ]
    },
    trainerMood() {
      if (this.lastAction === 'known') return 'happy'
      if (this.lastAction === 'weak') return 'nervous'
      return this.answerVisible ? 'go' : 'cocky'
    },
    trainerTone() {
      if (this.lastAction === 'known') return 'green'
      if (this.lastAction === 'weak') return 'orange'
      return 'cyan'
    },
    trainerAssistantMessage() {
      if (this.lastAction === 'known') return '认出来了！我咔一下给你记进熟练度。'
      if (this.lastAction === 'weak') return '没事，这题先收进复盘区，下次揍它。'
      if (this.answerVisible) return '答案亮出来了，先慢转两遍再求快。'
      return '先看图猜公式，别急着偷看答案。'
    }
  },
  onLoad(query) {
    if (query.id) {
      Object.keys(formulas).some(key => {
        const idx = formulas[key].findIndex(item => item.id === query.id)
        if (idx >= 0) {
          this.category = key
          this.index = idx
          return true
        }
        return false
      })
    }
  },
  methods: {
    goBack() {
      uni.redirectTo({ url: '/pages/practice/practice' })
    },
    switchCategory(key) {
      this.category = key
      this.index = 0
      this.answerVisible = false
      this.lastAction = ''
    },
    nextQuestion(resetAction = true) {
      this.index = (this.index + 1) % this.pool.length
      this.answerVisible = false
      if (resetAction) this.lastAction = ''
    },
    markKnown() {
      this.knownCount += 1
      this.streak += 1
      this.lastAction = 'known'
      this.nextQuestion(false)
    },
    markWeak() {
      this.wrongCount += 1
      this.streak = 0
      this.lastAction = 'weak'
      this.nextQuestion(false)
    },
    addMistake() {
      this.wrongCount += 1
      uni.showToast({ title: '已加入错题本', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.trainer-page {
  padding-bottom: 54rpx;
}

.segment {
  height: 76rpx;
  padding: 6rpx;
  border-radius: 8rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.segment-item {
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
}

.segment-item.active {
  color: #020617;
  font-weight: 900;
  background: #22d3ee;
}

.question-card {
  margin-top: 22rpx;
  padding: 28rpx;
  animation: fadeIn 0.22s ease;
}

.formula-name {
  color: var(--app-title);
  font-size: 39.6rpx;
  font-weight: 900;
}

.scene {
  margin-top: 12rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
  line-height: 39.6rpx;
}

.cube-board {
  width: 276rpx;
  margin: 34rpx auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7rpx;
}

.cube-piece {
  aspect-ratio: 1;
  border-radius: 6rpx;
  border: 1rpx solid rgba(2, 6, 23, 0.24);
}

.answer {
  margin-top: 30rpx;
  padding: 20rpx;
  border-radius: 8rpx;
  background: rgba(34, 211, 238, 0.1);
  border: 1rpx solid rgba(34, 211, 238, 0.22);
}

.answer-label {
  color: #22d3ee;
  font-size: 25.3rpx;
}

.answer-text {
  margin-top: 10rpx;
  display: block;
  color: var(--app-title);
  font-size: 41.8rpx;
  line-height: 55rpx;
}

.answer-cn {
  margin-top: 14rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
  line-height: 39.6rpx;
}

.show-btn {
  height: 76rpx;
  margin-top: 32rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 29.7rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
}

.action-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.action {
  height: 78rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28.6rpx;
  font-weight: 900;
}

.known {
  background: #22c55e;
}

.weak {
  background: #f97316;
}

.next {
  background: #2563eb;
}

.mistake {
  color: var(--app-title);
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.stat-card {
  padding: 20rpx 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  color: var(--app-title);
  font-size: 30.8rpx;
  font-weight: 900;
}

.stat-label {
  color: var(--app-text-secondary);
  font-size: 22rpx;
}

@keyframes fadeIn {
  from {
    opacity: 0.35;
    transform: translateY(8rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
