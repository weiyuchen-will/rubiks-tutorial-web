<template>
  <view v-if="visible" class="solve-layer">
    <view class="solve-sheet glass-card">
      <view class="solve-head">
        <view>
          <text class="solve-kicker">线上还原</text>
          <text class="solve-title">{{ title }}</text>
        </view>
        <view class="abandon-btn pressable" @tap="$emit('abandon')">放弃</view>
      </view>

      <text class="solve-copy">{{ subtitle }}</text>

      <view class="cube-stage">
        <view class="cube-face top-face">
          <view v-for="(color, idx) in facelets.top" :key="`t-${idx}`" class="sticker" :style="{ background: color }" />
        </view>
        <view class="cube-row">
          <view class="cube-face left-face">
            <view v-for="(color, idx) in facelets.left" :key="`l-${idx}`" class="sticker" :style="{ background: color }" />
          </view>
          <view class="cube-face front-face">
            <view v-for="(color, idx) in facelets.front" :key="`f-${idx}`" class="sticker" :style="{ background: color }" />
          </view>
          <view class="cube-face right-face">
            <view v-for="(color, idx) in facelets.right" :key="`r-${idx}`" class="sticker" :style="{ background: color }" />
          </view>
        </view>
      </view>

      <view class="solve-progress">
        <view class="progress-track">
          <view class="progress-fill" :style="{ width: progress + '%' }" />
        </view>
        <text class="progress-label">{{ currentStepLabel }}</text>
      </view>

      <view class="formula-grid">
        <view
          v-for="formula in formulas"
          :key="formula.id"
          class="formula-btn pressable"
          :class="{ primary: formula.id === expectedFormula.id }"
          @tap="turnFormula(formula)"
        >
          <text class="formula-name">{{ formula.name }}</text>
          <text class="formula-alg mono">{{ formula.alg }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const solvedFaces = {
  top: '#facc15',
  left: '#f97316',
  front: '#22c55e',
  right: '#2563eb'
}

const mixed = ['#f8fafc', '#facc15', '#ef4444', '#22c55e', '#2563eb', '#f97316']

export default {
  name: 'VirtualCubeSolve',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '虚拟魔方已展开' },
    subtitle: { type: String, default: '点击下方公式控制魔方转动，复原后会自动完成。' }
  },
  emits: ['solved', 'abandon'],
  data() {
    return {
      step: 0,
      formulas: [
        { id: 'cross', name: '白十字', alg: "F R U R' U' F'" },
        { id: 'slot', name: 'F2L 入槽', alg: "U R U' R'" },
        { id: 'oll', name: 'OLL 翻色', alg: "R U R' U R U2 R'" },
        { id: 'pll', name: 'PLL 换棱', alg: "R U' R U R U R U' R' U' R2" }
      ]
    }
  },
  computed: {
    expectedFormula() {
      return this.formulas[Math.min(this.step, this.formulas.length - 1)]
    },
    progress() {
      return Math.round((this.step / this.formulas.length) * 100)
    },
    currentStepLabel() {
      if (this.step >= this.formulas.length) return '已复原'
      return `第 ${this.step + 1}/${this.formulas.length} 步 · ${this.expectedFormula.name}`
    },
    facelets() {
      return {
        top: this.makeFace('top', 0),
        left: this.makeFace('left', 1),
        front: this.makeFace('front', 2),
        right: this.makeFace('right', 3)
      }
    }
  },
  watch: {
    visible(next) {
      if (next) this.step = 0
    }
  },
  methods: {
    makeFace(face, offset) {
      const solvedCount = Math.min(9, Math.max(0, this.step * 2 + offset))
      return Array.from({ length: 9 }, (_, idx) => {
        if (idx < solvedCount) return solvedFaces[face]
        return mixed[(idx + offset + this.step) % mixed.length]
      })
    },
    turnFormula(formula) {
      if (!this.visible || this.step >= this.formulas.length) return
      const expectedIdx = this.formulas.findIndex(item => item.id === this.expectedFormula.id)
      const tappedIdx = this.formulas.findIndex(item => item.id === formula.id)
      this.step = tappedIdx === expectedIdx
        ? this.step + 1
        : Math.max(0, this.step - 1)
      if (this.step >= this.formulas.length) {
        setTimeout(() => this.$emit('solved'), 280)
      }
    }
  }
}
</script>

<style scoped>
.solve-layer {
  position: fixed;
  z-index: 30;
  inset: 0;
  padding: 88rpx 24rpx 28rpx;
  display: flex;
  align-items: flex-end;
  background: rgba(2, 6, 23, 0.72);
}

.solve-sheet {
  width: 100%;
  max-height: 88vh;
  padding: 24rpx;
  overflow: auto;
  background:
    radial-gradient(circle at 18% 0%, rgba(34, 211, 238, 0.18), transparent 34%),
    var(--app-surface-strong);
}

.solve-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.solve-kicker {
  display: block;
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 900;
}

.solve-title {
  margin-top: 6rpx;
  display: block;
  color: var(--app-title);
  font-size: 35.2rpx;
  line-height: 44rpx;
  font-weight: 900;
}

.abandon-btn {
  flex: none;
  height: 58rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 25.3rpx;
  font-weight: 900;
  background: #ef4444;
}

.solve-copy {
  margin-top: 12rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
  line-height: 36rpx;
}

.cube-stage {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cube-row {
  display: flex;
  justify-content: center;
}

.cube-face {
  width: 132rpx;
  height: 132rpx;
  padding: 5rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
  border-radius: 8rpx;
  background: rgba(2, 6, 23, 0.7);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
}

.top-face {
  margin-left: 132rpx;
  transform: skewX(-18deg) translateY(8rpx);
}

.left-face {
  transform: skewY(16deg);
}

.right-face {
  transform: skewY(-16deg);
}

.front-face {
  margin: 0 6rpx;
}

.sticker {
  min-width: 0;
  border-radius: 5rpx;
  border: 1rpx solid rgba(2, 6, 23, 0.25);
}

.solve-progress {
  margin-top: 28rpx;
}

.progress-track {
  height: 12rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: var(--app-muted-panel);
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #22d3ee, #22c55e);
}

.progress-label {
  margin-top: 10rpx;
  display: block;
  color: var(--app-title);
  font-size: 25.3rpx;
  font-weight: 800;
}

.formula-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.formula-btn {
  min-width: 0;
  min-height: 100rpx;
  padding: 14rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.formula-btn.primary {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.13);
}

.formula-name {
  color: var(--app-title);
  font-size: 26.4rpx;
  font-weight: 900;
}

.formula-alg {
  color: var(--app-text-secondary);
  font-size: 22rpx;
  line-height: 28.6rpx;
}
</style>
