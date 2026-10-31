<template>
  <view class="page-shell detail-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">课程播放</text>
      <view class="icon-btn pressable" :class="{ saved: current.favorite }" @tap="current.favorite = !current.favorite">{{ current.favorite ? '★' : '☆' }}</view>
    </view>

    <view class="player">
      <view v-if="playing" class="mock-video">
        <text class="mock-video-title">{{ current.title }}</text>
        <text class="mock-video-sub">本地 mock 播放中</text>
      </view>
      <view v-else class="cover" @tap="playing = true">
        <view class="cover-cube">
          <view v-for="(color, idx) in cubeColors" :key="idx" :style="{ background: color }" />
        </view>
        <view class="play-btn">▶</view>
      </view>
    </view>

    <view class="info-card glass-card">
      <view class="title-row">
        <text class="course-title">{{ current.title }}</text>
        <text class="save pressable" :class="{ active: current.favorite }" @tap="current.favorite = !current.favorite">{{ current.favorite ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="meta-row">
        <text class="meta-chip" :style="{ color: current.tagColor, borderColor: current.tagColor }">{{ current.difficulty }}</text>
        <text>{{ current.cube }}</text>
        <text>{{ current.duration }}</text>
      </view>
    </view>

    <KafangAssistant :message="playing ? '我在旁边暂停眨眼，你先看老师怎么转。' : '点播放，我帮你盯住白色棱块。'" :mood="playing ? 'cocky' : 'go'" tone="purple" voice-pack="lesson" />

    <view class="section-head">
      <text class="section-title">学习步骤</text>
    </view>
    <view class="steps glass-card">
      <view v-for="(step, idx) in steps" :key="step.title" class="step-row">
        <text class="step-no">{{ idx + 1 }}</text>
        <view class="step-copy">
          <text class="step-title">{{ step.title }}</text>
          <text class="step-desc">{{ step.desc }}</text>
        </view>
      </view>
    </view>

    <view class="daily-unit glass-card">
      <view class="daily-copy">
        <text class="daily-kicker">每日小单元</text>
        <text class="daily-title">{{ dailyReward.claimedToday ? '今天的学习奖励已领取' : '完成 1 个小单元，延续连胜' }}</text>
        <text class="daily-desc">当前连续学习 {{ dailyReward.streak }} 天 · 奖励 +{{ dailyReward.points }} 积分 / +{{ dailyReward.coins }} 金币</text>
      </view>
      <view class="daily-claim pressable" :class="{ done: dailyReward.claimedToday }" @tap="claimDailyReward">
        {{ dailyReward.claimedToday ? '已领取' : '完成并领奖' }}
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">相关公式</text>
    </view>
    <scroll-view scroll-x class="formula-scroll" :show-scrollbar="false">
      <view class="formula-row">
        <view v-for="item in formulaCards" :key="item.id" class="formula-card glass-card card-press">
          <text class="formula-name">{{ item.name }}</text>
          <text class="formula mono">{{ item.alg }}</text>
          <text class="formula-cn">{{ item.cn }}</text>
          <view class="practice-btn pressable" @tap="goFormula(item.id)">去练习</view>
        </view>
      </view>
    </scroll-view>

    <view class="section-head">
      <text class="section-title">相关课程</text>
    </view>
    <view class="related-list">
      <view v-for="item in related" :key="item.id" class="related-card glass-card card-press" @tap="replaceCourse(item.id)">
        <text class="related-title ellipsis">{{ item.title }}</text>
        <text class="related-meta">{{ item.difficulty }} · {{ item.duration }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { cubeColors, formulas, tutorialLessonPlans, tutorials } from '@/common/mock.js'
import { applyDailyLearningReward, getDailyLearningRewardState, updateUserState } from '@/common/userState.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      id: 't1',
      playing: false,
      dailyReward: getDailyLearningRewardState(),
      cubeColors,
      list: tutorials.map(item => ({ ...item }))
    }
  },
  computed: {
    current() {
      return this.list.find(item => item.id === this.id) || this.list[0]
    },
    formulaCards() {
      return [formulas.basic[0], formulas.f2l[0], formulas.pll[0]]
    },
    currentLessonPlan() {
      return tutorialLessonPlans[this.current.id] || tutorialLessonPlans.t1
    },
    steps() {
      return this.currentLessonPlan.steps
    },
    related() {
      return this.list.filter(item => item.id !== this.current.id).slice(0, 3)
    }
  },
  onLoad(query) {
    if (query.id) this.id = query.id
    this.rememberCurrentTutorial()
  },
  onShow() {
    this.dailyReward = getDailyLearningRewardState()
  },
  methods: {
    back() {
      uni.navigateBack({
        fail: () => uni.redirectTo({ url: '/pages/tutorials/tutorials' })
      })
    },
    goFormula(id) {
      uni.navigateTo({ url: `/pages/formula-trainer/formula-trainer?id=${id}` })
    },
    replaceCourse(id) {
      this.id = id
      this.playing = false
      this.rememberCurrentTutorial()
    },
    rememberCurrentTutorial() {
      updateUserState({ currentTutorialId: this.current.id })
    },
    claimDailyReward() {
      const result = applyDailyLearningReward(this.current.id)
      this.dailyReward = getDailyLearningRewardState()
      uni.showToast({
        title: result.rewarded ? `连胜 ${result.streak} 天 +${result.coins} 金币` : '今天已领取',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.detail-page {
  padding-bottom: 54rpx;
}

.saved,
.save.active {
  color: #facc15;
}

.player {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8rpx;
  background: #000;
}

.cover {
  width: 100%;
  height: 100%;
}

.mock-video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
}

.mock-video-title {
  max-width: 86%;
  overflow: hidden;
  color: #e0f2fe;
  font-size: 33rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mock-video-sub {
  margin-top: 14rpx;
  color: #64748b;
  font-size: 26.4rpx;
}

.cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 40%, rgba(34, 211, 238, 0.22), #000 60%);
}

.cover-cube {
  width: 142rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6rpx;
  opacity: 0.72;
  transform: rotate(-8deg);
}

.cover-cube view {
  aspect-ratio: 1;
  border-radius: 5rpx;
}

.play-btn {
  position: absolute;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 39.6rpx;
  background: #22d3ee;
}

.info-card {
  margin-top: 22rpx;
  padding: 24rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.course-title {
  flex: 1;
  color: var(--app-title);
  font-size: 37.4rpx;
  line-height: 48.4rpx;
  font-weight: 900;
}

.save {
  height: 52rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
  background: var(--app-muted-panel);
}

.meta-row {
  margin-top: 18rpx;
  display: flex;
  gap: 14rpx;
  color: var(--app-chip-text);
  font-size: 26.4rpx;
}

.meta-chip {
  padding: 2rpx 12rpx;
  border: 1rpx solid;
  border-radius: 8rpx;
}

.steps {
  padding: 6rpx 20rpx;
}

.step-row {
  padding: 20rpx 0;
  display: flex;
  gap: 18rpx;
  border-bottom: 1rpx solid var(--app-border);
}

.step-row:last-child {
  border-bottom: 0;
}

.step-no {
  width: 44rpx;
  height: 44rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 26.4rpx;
  font-weight: 900;
  background: #22d3ee;
}

.step-copy {
  min-width: 0;
  flex: 1;
}

.step-title {
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 800;
}

.step-desc {
  margin-top: 8rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
  line-height: 35.2rpx;
}

.daily-unit {
  margin-top: 22rpx;
  padding: 22rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
  border-color: rgba(34, 197, 94, 0.3);
  background:
    linear-gradient(135deg, rgba(34, 197, 94, 0.14), rgba(34, 211, 238, 0.08)),
    var(--app-surface);
}

.daily-copy {
  min-width: 0;
  flex: 1;
}

.daily-kicker {
  display: block;
  color: #22c55e;
  font-size: 24.2rpx;
  font-weight: 900;
}

.daily-title {
  margin-top: 8rpx;
  display: block;
  color: var(--app-title);
  font-size: 31.9rpx;
  line-height: 41.8rpx;
  font-weight: 900;
}

.daily-desc {
  margin-top: 8rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
  line-height: 35.2rpx;
}

.daily-claim {
  flex: 0 0 auto;
  min-width: 154rpx;
  height: 62rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #052e16;
  font-size: 24.2rpx;
  font-weight: 900;
  background: #22c55e;
}

.daily-claim.done {
  color: var(--app-text-secondary);
  background: var(--app-muted-panel);
}

.formula-row {
  width: max-content;
  display: flex;
  gap: 16rpx;
}

.formula-card {
  width: 320rpx;
  padding: 22rpx;
}

.formula-name {
  color: var(--app-text-primary);
  font-size: 27.5rpx;
  font-weight: 800;
}

.formula {
  margin-top: 16rpx;
  display: block;
  color: var(--app-title);
  font-size: 33rpx;
  line-height: 44rpx;
}

.formula-cn {
  margin-top: 10rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
  line-height: 35.2rpx;
}

.practice-btn {
  width: 132rpx;
  height: 48rpx;
  margin-top: 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  font-size: 25.3rpx;
  border: 1rpx solid #22d3ee;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.related-card {
  padding: 20rpx;
}

.related-title {
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 800;
}

.related-meta {
  margin-top: 8rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
}
</style>
