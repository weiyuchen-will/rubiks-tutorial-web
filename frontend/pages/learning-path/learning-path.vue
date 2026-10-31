<template>
  <view class="page-shell path-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">学习路线</text>
      <view class="icon-btn">路</view>
    </view>

    <view class="overview glass-card">
      <text class="path-title">{{ path.title }}</text>
      <text class="path-desc">{{ path.desc }}</text>
      <view class="progress-line">
        <view class="progress-fill" :style="{ width: path.progress + '%' }" />
      </view>
      <text class="progress-text">整体进度 {{ path.progress }}%</text>
    </view>

    <KafangAssistant :message="`下一关是 ${nextCourse.title}，我已经把路线摆好了。`" mood="go" tone="cyan" voice-pack="lesson" />

    <view class="section-head">
      <text class="section-title">阶段列表</text>
    </view>
    <view class="stage-list">
      <view v-for="(stage, idx) in stages" :key="stage.name" class="stage-card glass-card">
        <view class="stage-head">
          <text class="stage-no">阶段 {{ idx + 1 }}</text>
          <text class="stage-state" :class="{ done: stage.done }">{{ stage.done ? '已完成' : '进行中' }}</text>
        </view>
        <text class="stage-name">{{ stage.name }}</text>
        <view class="course-list">
          <view v-for="course in stage.courses" :key="course.id" class="course-row card-press" :class="{ recommend: course.id === nextCourse.id }" @tap="openCourse(course.id)">
            <text class="check" :class="{ done: course.done }">{{ course.done ? '✓' : '○' }}</text>
            <text class="course-title ellipsis">{{ course.title }}</text>
            <text class="course-time">{{ course.duration }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="next-btn pressable" @tap="openCourse(nextCourse.id)">下一步学习：{{ nextCourse.title }}</view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { learningPaths, tutorials } from '@/common/mock.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      type: 'beginner',
      stages: [
        { name: '认识魔方', done: true, courses: [{ ...tutorials[0], done: true }] },
        { name: '白十字', done: true, courses: [{ ...tutorials[0], title: '白十字复盘', done: true }] },
        { name: '第一层', done: false, courses: [{ ...tutorials[1], done: false }] },
        { name: '第二层', done: false, courses: [{ ...tutorials[2], done: false }] },
        { name: '顶层复原', done: false, courses: [{ ...tutorials[4], done: false }] }
      ]
    }
  },
  computed: {
    path() {
      return learningPaths.find(item => item.type === this.type) || learningPaths[0]
    },
    nextCourse() {
      for (const stage of this.stages) {
        const target = stage.courses.find(item => !item.done)
        if (target) return target
      }
      return this.stages[0].courses[0]
    }
  },
  onLoad(query) {
    if (query.type) this.type = query.type
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/tutorials/tutorials' })
    },
    openCourse(id) {
      uni.navigateTo({ url: `/pages/tutorial-detail/tutorial-detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.path-page {
  padding-bottom: 54rpx;
}

.overview {
  padding: 28rpx;
  background:
    linear-gradient(135deg, rgba(34, 211, 238, 0.22), var(--app-muted-panel)),
    var(--app-surface);
}

.path-title {
  color: var(--app-title);
  font-size: 39.6rpx;
  font-weight: 900;
}

.path-desc {
  margin-top: 12rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
  line-height: 39.6rpx;
}

.progress-line {
  height: 12rpx;
  margin-top: 24rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: var(--app-muted-panel);
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
  background: #22d3ee;
}

.progress-text {
  margin-top: 12rpx;
  display: block;
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}

.stage-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.stage-card {
  padding: 22rpx;
}

.stage-head {
  display: flex;
  justify-content: space-between;
}

.stage-no {
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}

.stage-state {
  color: #f97316;
  font-size: 24.2rpx;
}

.stage-state.done {
  color: #22c55e;
}

.stage-name {
  margin-top: 10rpx;
  display: block;
  color: var(--app-title);
  font-size: 31.9rpx;
  font-weight: 900;
}

.course-list {
  margin-top: 14rpx;
}

.course-row {
  height: 70rpx;
  padding: 0 12rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.course-row.recommend {
  border: 1rpx solid #22d3ee;
  background: rgba(34, 211, 238, 0.08);
}

.check {
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
}

.check.done {
  color: #22c55e;
}

.course-title {
  flex: 1;
  color: var(--app-text-primary);
  font-size: 27.5rpx;
}

.course-time {
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
}

.next-btn {
  height: 86rpx;
  margin-top: 24rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 29.7rpx;
  font-weight: 900;
  background: #22d3ee;
}
</style>
