<template>
  <view class="simple-home page-with-tab">
    <view class="home-canvas">
      <view class="course-hero">
        <view class="hero-head">
          <view class="hero-title">
            <text class="hero-kicker">魔方课程</text>
            <text class="hero-name">{{ currentLessonPlan.heroName }}</text>
          </view>
          <view class="hero-menu" @tap="go('/pages/tutorials/tutorials')">☰</view>
        </view>

        <view class="status-row">
          <view v-for="stat in stats" :key="stat.label" class="status-item" :class="stat.tone">
            <text class="status-icon">{{ stat.icon }}</text>
            <text class="status-value">{{ stat.value }}</text>
          </view>
        </view>

        <view class="mission-card" @tap="openPrimaryLesson">
          <view class="mission-cube" aria-hidden="true">
            <view v-for="color in cubePalette" :key="color" class="cube-cell" :style="{ background: color }" />
          </view>
          <view class="mission-copy">
            <text class="mission-stage">{{ currentLessonPlan.missionStage }}</text>
            <text class="mission-title">{{ currentLessonPlan.missionTitle }}</text>
            <view class="mission-progress">
              <view class="mission-progress-fill" />
            </view>
          </view>
          <view class="mission-action">
            <text>▶</text>
          </view>
        </view>

        <view class="daily-goal">
          <view class="goal-copy">
            <text class="goal-label">今日目标</text>
            <text class="goal-text">完成 1 节教程，点亮一个魔方色块</text>
          </view>
          <view class="goal-cubes">
            <view
              v-for="(color, index) in cubePalette.slice(0, 6)"
              :key="`goal-${color}`"
              class="goal-cube"
              :class="{ done: index < todayPractice.completedSteps }"
              :style="{ background: index < todayPractice.completedSteps ? color : 'rgba(148, 163, 184, 0.28)' }"
            />
          </view>
        </view>
      </view>

      <view class="lesson-path">
        <view
          v-for="(node, index) in lessonNodes"
          :key="node.label"
          class="lesson-node"
          :class="[node.state, node.tone, `lane-${index % 4}`]"
          @tap="openLesson(node)"
        >
          <view class="node-disc">
            <text class="node-icon">{{ node.icon }}</text>
          </view>
          <text class="node-label">{{ node.label }}</text>
        </view>
      </view>

    </view>

    <AppTabBar current="home" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import { tutorialLessonPlans } from '@/common/mock.js'
import { getTodayPracticeState, getUserState } from '@/common/userState.js'

export default {
  components: { AppTabBar },
  data() {
    const user = getUserState()
    return {
      user,
      todayPractice: getTodayPracticeState(),
      cubePalette: ['#ffffff', '#facc15', '#ef4444', '#38bdf8', '#22c55e', '#f97316', '#a855f7', '#2563eb', '#ec4899'],
      currentTutorialId: user.currentTutorialId || 't1'
    }
  },
  computed: {
    stats() {
      return [
        { label: '连胜', icon: '🔥', value: this.user.streak || 0, tone: 'red' },
        { label: '今日练习', icon: '⏱', value: `${this.todayPractice.practiceDone}/${this.todayPractice.practiceTarget}`, tone: 'gray' },
        { label: '金币', icon: '◆', value: this.user.coins || 0, tone: 'blue' },
        { label: '积分', icon: '⚡', value: this.user.points || 0, tone: 'pink' }
      ]
    },
    currentLessonPlan() {
      return tutorialLessonPlans[this.currentTutorialId] || tutorialLessonPlans.t1
    },
    lessonNodes() {
      return this.currentLessonPlan.nodes
    }
  },
  onShow() {
    this.refreshState()
  },
  methods: {
    refreshState() {
      this.user = getUserState()
      this.currentTutorialId = this.user.currentTutorialId || 't1'
      this.todayPractice = getTodayPracticeState()
    },
    openPrimaryLesson() {
      uni.navigateTo({ url: `/pages/tutorial-detail/tutorial-detail?id=${this.currentLessonPlan.primaryTutorialId}` })
    },
    openLesson(node) {
      if (node.tutorialId) {
        uni.navigateTo({ url: `/pages/tutorial-detail/tutorial-detail?id=${node.tutorialId}` })
        return
      }
      this.go(node.path)
    },
    go(path) {
      uni.navigateTo({ url: path })
    }
  }
}
</script>

<style scoped>
.simple-home {
  min-height: 100vh;
  color: var(--app-text-primary);
  background: var(--home-bg);
}

.home-canvas {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  padding: calc(34rpx + env(safe-area-inset-top)) 26rpx calc(154rpx + env(safe-area-inset-bottom));
  background: var(--home-bg);
}

.course-hero {
  padding: 24rpx 24rpx 26rpx;
  border-radius: 8rpx;
  background:
    radial-gradient(circle at 14% 0%, rgba(34, 211, 238, 0.2), transparent 30%),
    radial-gradient(circle at 92% 22%, rgba(244, 114, 182, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(8, 13, 30, 0.94));
  border: 1rpx solid rgba(56, 189, 248, 0.18);
  box-shadow: 0 18rpx 42rpx rgba(2, 6, 23, 0.26);
}

.hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.hero-title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.hero-kicker {
  color: #38d5ff;
  font-size: 22rpx;
  font-weight: 900;
}

.hero-name {
  color: #f8fafc;
  font-size: 34rpx;
  line-height: 40rpx;
  font-weight: 900;
}

.hero-menu {
  width: 64rpx;
  height: 64rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38d5ff;
  font-size: 36rpx;
  font-weight: 900;
  background: rgba(56, 213, 255, 0.12);
  border: 1rpx solid rgba(56, 213, 255, 0.24);
}

.status-row {
  min-height: 82rpx;
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  gap: 10rpx;
}

.status-item {
  min-width: 0;
  height: 62rpx;
  padding: 0 8rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  color: var(--home-muted-icon);
  font-weight: 900;
  background: rgba(255, 255, 255, 0.055);
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.status-icon {
  font-size: 32rpx;
  line-height: 1;
}

.status-value {
  min-width: 0;
  overflow: hidden;
  font-size: 27rpx;
  line-height: 32rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.status-item.red {
  color: #ff5a5f;
}

.status-item.blue {
  color: #38bdf8;
}

.status-item.pink {
  color: #f472c4;
}

.mission-card {
  position: relative;
  min-height: 168rpx;
  margin-top: 18rpx;
  border-radius: 8rpx;
  display: grid;
  grid-template-columns: 86rpx 1fr 72rpx;
  gap: 16rpx;
  align-items: center;
  padding: 22rpx 20rpx;
  overflow: hidden;
  color: #ffffff;
  background:
    radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.2), transparent 24%),
    linear-gradient(135deg, #06b6d4, #22d3ee 58%, #38bdf8);
  box-shadow: inset 0 -10rpx 0 var(--home-mission-inset), 0 8rpx 0 var(--home-mission-shadow);
}

.mission-cube {
  position: relative;
  right: auto;
  top: auto;
  width: 82rpx;
  height: 82rpx;
  padding: 5rpx;
  border-radius: 8rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rpx;
  background: rgba(2, 6, 23, 0.18);
  transform: rotate(-7deg);
  box-shadow: 0 10rpx 18rpx rgba(2, 6, 23, 0.16);
}

.cube-cell {
  border-radius: 3rpx;
  box-shadow: inset 0 -2rpx 0 rgba(2, 6, 23, 0.18);
}

.mission-card:active,
.lesson-node:active {
  opacity: 0.86;
  transform: scale(0.98);
}

.mission-copy {
  min-width: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 0;
}

.mission-stage {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 25rpx;
  line-height: 32rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mission-title {
  margin-top: 6rpx;
  overflow: hidden;
  color: #ffffff;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mission-progress {
  height: 12rpx;
  margin-top: 16rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: rgba(2, 6, 23, 0.2);
}

.mission-progress-fill {
  width: 48%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffffff, #facc15);
}

.mission-action {
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0891b2;
  font-size: 28rpx;
  font-weight: 900;
  background: #ffffff;
}

.daily-goal {
  min-height: 76rpx;
  margin-top: 18rpx;
  padding: 14rpx 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.09);
}

.goal-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.goal-label {
  color: #facc15;
  font-size: 21rpx;
  font-weight: 900;
}

.goal-text {
  overflow: hidden;
  color: #cbd5e1;
  font-size: 22rpx;
  line-height: 28rpx;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.goal-cubes {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(3, 22rpx);
  gap: 5rpx;
}

.goal-cube {
  width: 22rpx;
  height: 22rpx;
  border-radius: 4rpx;
  box-shadow: inset 0 -3rpx 0 rgba(2, 6, 23, 0.24);
}

.goal-cube.done {
  box-shadow: inset 0 -3rpx 0 rgba(2, 6, 23, 0.24), 0 0 10rpx rgba(250, 204, 21, 0.26);
}

.lesson-path {
  position: relative;
  min-height: 1160rpx;
  padding: 54rpx 0 46rpx;
}

.lesson-path::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 72rpx;
  bottom: 96rpx;
  width: 12rpx;
  border-radius: 999rpx;
  opacity: 0.22;
  background: linear-gradient(180deg, #22d3ee, #facc15, #22c55e, #f97316, #a855f7);
  transform: translateX(-50%);
}

.lesson-node {
  width: 230rpx;
  margin-bottom: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  transition: transform 0.14s ease, opacity 0.14s ease;
}

.lesson-node.lane-0 {
  margin-left: 290rpx;
}

.lesson-node.lane-1 {
  margin-left: 138rpx;
}

.lesson-node.lane-2 {
  margin-left: 392rpx;
}

.lesson-node.lane-3 {
  margin-left: 202rpx;
}

.node-disc {
  position: relative;
  width: 124rpx;
  height: 104rpx;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--home-node-icon);
  background: var(--home-node-bg);
  box-shadow: 0 18rpx 0 var(--home-node-shadow);
}

.node-disc::before {
  content: "";
  position: absolute;
  inset: -18rpx;
  z-index: 0;
  border-radius: 42rpx;
  border: 12rpx solid transparent;
}

.active .node-disc {
  color: #ffffff;
  background:
    radial-gradient(circle at 36% 28%, rgba(255, 255, 255, 0.36), transparent 24%),
    linear-gradient(135deg, #0ea5e9, #22d3ee);
  box-shadow: 0 16rpx 0 var(--home-active-node-shadow), 0 0 34rpx rgba(34, 211, 238, 0.34);
}

.active .node-disc::before {
  border-top-color: #67e8f9;
  border-right-color: #0ea5e9;
  border-left-color: var(--home-ring-muted);
  border-bottom-color: var(--home-ring-muted);
  transform: rotate(-20deg);
}

.ready .node-disc,
.locked .node-disc {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--node-accent) 20%, transparent), transparent),
    var(--home-ready-node-bg);
  box-shadow: 0 16rpx 0 var(--home-node-shadow);
}

.cyan {
  --node-accent: #22d3ee;
}

.yellow {
  --node-accent: #facc15;
}

.green {
  --node-accent: #22c55e;
}

.orange {
  --node-accent: #f97316;
}

.purple {
  --node-accent: #a855f7;
}

.pink {
  --node-accent: #ec4899;
}

.ready .node-icon,
.locked .node-icon {
  color: var(--node-accent);
}

.locked .node-disc {
  opacity: 0.48;
}

.node-icon {
  position: relative;
  z-index: 2;
  font-size: 49rpx;
  line-height: 1;
  font-weight: 900;
}

.node-label {
  position: relative;
  z-index: 3;
  max-width: 176rpx;
  overflow: hidden;
  color: var(--home-label-muted);
  font-size: 23rpx;
  line-height: 30rpx;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.active .node-label,
.ready .node-label {
  color: var(--home-label-strong);
}

:global(html) {
  --home-bg: #050a18;
  --home-muted-icon: #64748b;
  --home-node-icon: #7b8797;
  --home-node-bg: #273246;
  --home-ready-node-bg: #202a3d;
  --home-node-shadow: #111827;
  --home-active-node-shadow: #0891b2;
  --home-mission-inset: rgba(8, 47, 73, 0.34);
  --home-mission-shadow: #0891b2;
  --home-mission-divider: rgba(8, 145, 178, 0.42);
  --home-ring-muted: #334155;
  --home-label-muted: #64748b;
  --home-label-strong: #cbd5e1;
}

:global(html[data-theme="light"]),
:global(body[data-theme="light"]) {
  --home-bg: #f7fbff;
  --home-muted-icon: #94a3b8;
  --home-node-icon: #94a3b8;
  --home-node-bg: #e6f4fb;
  --home-ready-node-bg: #f1f7fb;
  --home-node-shadow: #cbdde8;
  --home-active-node-shadow: #0284c7;
  --home-mission-inset: rgba(14, 116, 144, 0.18);
  --home-mission-shadow: #0284c7;
  --home-mission-divider: rgba(8, 145, 178, 0.34);
  --home-ring-muted: #dbeafe;
  --home-label-muted: #64748b;
  --home-label-strong: #334155;
}

@media (max-width: 360px) {
  .lesson-node.lane-0 {
    margin-left: 238rpx;
  }

  .lesson-node.lane-1 {
    margin-left: 112rpx;
  }

  .lesson-node.lane-2 {
    margin-left: 330rpx;
  }

  .lesson-node.lane-3 {
    margin-left: 170rpx;
  }
}
</style>
