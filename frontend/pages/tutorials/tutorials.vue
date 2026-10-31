<template>
  <view class="page-shell page-with-tab">
    <view class="top-bar">
      <text class="top-title">{{ $t('titleTutorials') }}</text>
      <view class="icon-btn">▦</view>
    </view>

    <view class="search-box">
      <text class="search-icon">⌕</text>
      <input v-model="keyword" class="search-input" placeholder="搜索教程、公式、标签" placeholder-class="placeholder" />
    </view>

    <scroll-view class="type-scroll" scroll-x :show-scrollbar="false">
      <view class="type-row">
        <view v-for="type in cubeTypes" :key="type" class="chip pressable" :class="{ active: cubeType === type }" @tap="cubeType = type">{{ type }}</view>
      </view>
    </scroll-view>

    <view class="segment">
      <view v-for="item in difficulties" :key="item" class="segment-item pressable" :class="{ active: difficulty === item }" @tap="difficulty = item">{{ item }}</view>
    </view>

    <view v-if="hasSearch && filteredFormulaCards.length" class="search-formulas">
      <view class="section-head">
        <text class="section-title">相关公式</text>
        <text class="muted">{{ filteredFormulaCards.length }} 个</text>
      </view>
      <scroll-view scroll-x class="formula-scroll" :show-scrollbar="false">
        <view class="formula-row">
          <view v-for="item in filteredFormulaCards" :key="item.id" class="formula-card glass-card card-press" @tap="goFormula(item.id)">
            <view class="formula-head">
              <text class="formula-name ellipsis">{{ item.name }}</text>
              <text class="formula-category">{{ item.categoryLabel }}</text>
            </view>
            <text class="formula-alg mono ellipsis">{{ item.alg }}</text>
            <text class="formula-cn line-clamp-2">{{ item.scene }}</text>
            <view class="formula-action pressable">去练习</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <KafangAssistant v-if="!hasSearch" message="今天我当助教，先把路线啃下来，再去练手速。" mood="cocky" tone="purple" voice-pack="lesson" />

    <template v-if="!hasSearch">
      <view class="section-head">
        <text class="section-title">学习路线</text>
      </view>
      <scroll-view scroll-x class="path-scroll" :show-scrollbar="false">
        <view class="path-row">
          <view v-for="path in learningPaths" :key="path.type" class="path-card glass-card card-press" @tap="openPath(path.type)">
            <text class="path-title">{{ path.title }}</text>
            <text class="path-desc ellipsis">{{ path.desc }}</text>
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: path.progress + '%' }" />
            </view>
            <text class="progress-text">{{ path.progress }}%</text>
          </view>
        </view>
      </scroll-view>
    </template>

    <view class="section-head">
      <text class="section-title">{{ hasSearch ? '相关教程视频' : '教程视频' }}</text>
      <text class="muted">{{ filteredTutorials.length }} 个</text>
    </view>
    <view v-if="filteredTutorials.length" class="video-list">
      <view v-for="item in filteredTutorials" :key="item.id" class="video-card glass-card card-press" @tap="openTutorial(item.id)">
        <view class="video-cover">
          <view class="play">▶</view>
          <view class="cover-grid">
            <view v-for="(color, idx) in cubeColors" :key="idx" :style="{ background: color }" />
          </view>
        </view>
        <view class="video-info">
          <view class="video-title-row">
            <text class="video-title ellipsis">{{ item.title }}</text>
            <text class="favorite pressable" :class="{ active: item.favorite }" @tap.stop="toggleFavorite(item.id)">{{ item.favorite ? '★' : '☆' }}</text>
          </view>
          <text class="video-intro line-clamp-2">{{ item.intro }}</text>
          <view class="video-meta">
            <text class="tag" :style="{ color: item.tagColor, borderColor: item.tagColor }">{{ item.difficulty }}</text>
            <text class="meta-text">{{ item.cube }}</text>
            <text class="meta-text">{{ item.duration }}</text>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty glass-card">
      <text>暂无匹配教程</text>
    </view>

    <AppTabBar current="tutorials" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { cubeColors, formulas, learningPaths, tutorials } from '@/common/mock.js'

const formulaCategoryLabels = {
  basic: '基础 入门 手法 公式',
  f2l: 'F2L 进阶 配对 公式',
  oll: 'OLL 顶层 朝向 公式',
  pll: 'PLL 顶层 换位 识别 公式'
}

const formulaCategoryNames = {
  basic: '基础',
  f2l: 'F2L',
  oll: 'OLL',
  pll: 'PLL'
}

const tutorialFormulaCategories = {
  t1: ['basic'],
  t2: ['basic'],
  t3: ['f2l'],
  t5: ['oll', 'pll']
}

const searchAliases = ['公式', '教程', '视频', '课程', '标签', '入门', '进阶', '提速', '基础', '手法', '顶层', '配对', '识别']

function normalizeSearchText(value) {
  return String(value || '').trim().toLowerCase()
}

function getSearchTokens(keyword) {
  const normalized = normalizeSearchText(keyword)
  if (!normalized) return []
  const spacedTokens = normalized.split(/\s+/).filter(Boolean)
  const aliasTokens = searchAliases.filter(alias => normalized.includes(alias.toLowerCase()))
  const remainder = searchAliases.reduce((text, alias) => text.split(alias.toLowerCase()).join(' '), normalized)
  const remainderTokens = remainder.split(/\s+/).filter(Boolean)
  return Array.from(new Set([...aliasTokens, ...remainderTokens, ...(aliasTokens.length ? [] : spacedTokens)]))
}

function flattenFormulaCategory(category) {
  return (formulas[category] || [])
    .map(item => `${item.name} ${item.scene} ${item.alg} ${item.cn}`)
    .join(' ')
}

function getAllFormulaCards() {
  return Object.entries(formulas).flatMap(([category, items]) => {
    return items.map(item => ({
      ...item,
      category,
      categoryLabel: formulaCategoryNames[category] || category
    }))
  })
}

export default {
  components: { AppTabBar, KafangAssistant },
  data() {
    return {
      keyword: '',
      cubeType: '全部',
      difficulty: '入门',
      cubeTypes: ['全部', '2x2', '3x3', '4x4', '5x5', '金字塔', 'SQ1'],
      difficulties: ['入门', '进阶', '提速'],
      learningPaths,
      cubeColors,
      formulaList: getAllFormulaCards(),
      list: tutorials.map(item => ({ ...item }))
    }
  },
  computed: {
    searchTokens() {
      return getSearchTokens(this.keyword)
    },
    hasSearch() {
      return this.searchTokens.length > 0
    },
    filteredFormulaCards() {
      if (!this.hasSearch) return []
      return this.formulaList.filter(item => {
        return this.searchTokens.every(token => this.getFormulaSearchText(item).includes(token))
      })
    },
    filteredTutorials() {
      const tokens = this.searchTokens
      return this.list.filter(item => {
        const matchType = this.cubeType === '全部' || item.cube === this.cubeType
        const matchDifficulty = Boolean(tokens.length) || item.difficulty === this.difficulty
        const matchKeyword = !tokens.length || tokens.every(token => this.getTutorialSearchText(item).includes(token))
        return matchType && matchDifficulty && matchKeyword
      })
    }
  },
  methods: {
    getTutorialSearchText(item) {
      const categoryText = (tutorialFormulaCategories[item.id] || [])
        .map(category => `${formulaCategoryLabels[category]} ${flattenFormulaCategory(category)}`)
        .join(' ')
      return normalizeSearchText([
        item.title,
        item.intro,
        item.cube,
        item.difficulty,
        '教程 视频 课程 标签',
        categoryText
      ].join(' '))
    },
    getFormulaSearchText(item) {
      return normalizeSearchText([
        item.name,
        item.scene,
        item.alg,
        item.cn,
        item.category,
        item.categoryLabel,
        '公式 训练 教程'
      ].join(' '))
    },
    goFormula(id) {
      uni.navigateTo({ url: `/pages/formula-trainer/formula-trainer?id=${id}` })
    },
    openTutorial(id) {
      uni.navigateTo({ url: `/pages/tutorial-detail/tutorial-detail?id=${id}` })
    },
    openPath(type) {
      uni.navigateTo({ url: `/pages/learning-path/learning-path?type=${type}` })
    },
    toggleFavorite(id) {
      const item = this.list.find(t => t.id === id)
      if (item) item.favorite = !item.favorite
    }
  }
}
</script>

<style scoped>
.search-box {
  height: 88rpx;
  padding: 0 22rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.search-icon {
  color: #22d3ee;
  font-size: 35.2rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  color: var(--app-title);
  font-size: 28.6rpx;
}

.placeholder {
  color: var(--app-text-secondary);
}

.type-scroll,
.path-scroll {
  width: 100%;
}

.type-row {
  width: max-content;
  padding: 22rpx 0 10rpx;
  display: flex;
  gap: 14rpx;
}

.segment {
  height: 76rpx;
  padding: 6rpx;
  border-radius: 8rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.segment-item {
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
  font-size: 27.5rpx;
}

.segment-item.active {
  color: #06121e;
  font-weight: 900;
  background: #22d3ee;
}

.search-formulas {
  margin-top: 4rpx;
}

.formula-scroll {
  width: 100%;
}

.formula-row {
  width: max-content;
  display: flex;
  gap: 16rpx;
}

.formula-card {
  width: 322rpx;
  min-height: 214rpx;
  padding: 18rpx;
}

.formula-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.formula-name {
  min-width: 0;
  flex: 1;
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 900;
}

.formula-category {
  height: 34rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
  color: #06121e;
  font-size: 22rpx;
  font-weight: 900;
  line-height: 35.2rpx;
  background: #22d3ee;
}

.formula-alg {
  margin-top: 16rpx;
  display: block;
  color: #f8fafc;
  font-size: 26.4rpx;
}

.formula-cn {
  margin-top: 10rpx;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
  line-height: 34rpx;
}

.formula-action {
  width: 112rpx;
  height: 42rpx;
  margin-top: 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #06121e;
  font-size: 24.2rpx;
  font-weight: 900;
  background: #facc15;
}

.path-row {
  width: max-content;
  display: flex;
  gap: 16rpx;
}

.path-card {
  width: 284rpx;
  padding: 22rpx;
}

.path-title {
  color: var(--app-title);
  font-size: 30.8rpx;
  font-weight: 900;
}

.path-desc {
  margin-top: 10rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
}

.progress-track {
  height: 10rpx;
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
  font-size: 24.2rpx;
  font-weight: 800;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.video-card {
  padding: 16rpx;
  display: flex;
  gap: 18rpx;
}

.video-cover {
  position: relative;
  width: 218rpx;
  height: 122rpx;
  flex: 0 0 218rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(168, 85, 247, 0.18));
}

.cover-grid {
  position: absolute;
  right: 18rpx;
  top: 18rpx;
  width: 76rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
}

.cover-grid view {
  aspect-ratio: 1;
  border-radius: 4rpx;
}

.play {
  position: absolute;
  left: 18rpx;
  bottom: 16rpx;
  z-index: 2;
  width: 46rpx;
  height: 46rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 24.2rpx;
  background: #22d3ee;
}

.video-info {
  min-width: 0;
  flex: 1;
}

.video-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.video-title {
  flex: 1;
  color: var(--app-title);
  font-size: 30.8rpx;
  font-weight: 800;
}

.favorite {
  width: 44rpx;
  text-align: center;
  color: var(--app-text-secondary);
  font-size: 35.2rpx;
}

.favorite.active {
  color: #facc15;
}

.video-intro {
  margin-top: 10rpx;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
  line-height: 35.2rpx;
}

.video-meta {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.tag {
  height: 34rpx;
  padding: 0 10rpx;
  border: 1rpx solid;
  border-radius: 8rpx;
  font-size: 22rpx;
  line-height: 35.2rpx;
}

.meta-text {
  color: var(--app-chip-text);
  font-size: 24.2rpx;
}

.empty {
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
  font-size: 28.6rpx;
}
</style>
