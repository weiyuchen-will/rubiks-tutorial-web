<template>
  <view class="page-shell page-with-tab">
    <view class="top-bar">
      <text class="top-title">{{ $t('titleProfile') }}</text>
      <view class="icon-btn">⚙</view>
    </view>

    <view class="profile-card card-press" @tap="go('/pages/edit-profile/edit-profile')">
      <view class="avatar-wrap" :style="{ background: avatarFrameGradient }">
        <image v-if="user.avatarImage" class="avatar-image" :src="user.avatarImage" mode="aspectFill" />
        <view v-else class="avatar-face" :style="{ background: avatarGradient }">
          <text>{{ avatarOption.icon }}</text>
        </view>
      </view>
      <view class="profile-info">
        <text class="name ellipsis">{{ user.name }}</text>
        <text class="level">Lv.{{ user.level }} · {{ user.points }} 积分 · {{ user.coins }} 金币</text>
      </view>
    </view>

    <KafangAssistant message="我把你的练习、金币和徽章都收好了，今天继续冲。" mood="happy" tone="cyan" voice-pack="profile" />

    <view class="data-grid">
      <view v-for="item in dataStats" :key="item.label" class="data-card glass-card">
        <text class="data-value">{{ item.value }}</text>
        <text class="data-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('profileProgress') }}</text>
    </view>
    <view class="progress-card glass-card">
      <view v-for="path in learningPaths" :key="path.type" class="progress-row">
        <view class="progress-copy">
          <text class="path-title">{{ path.title }}</text>
          <text class="path-percent">{{ path.progress }}%</text>
        </view>
        <view class="track">
          <view class="fill" :style="{ width: path.progress + '%' }" />
        </view>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('profileEntries') }}</text>
    </view>
    <view class="entry-list glass-card">
      <view v-for="item in entries" :key="item.titleKey" class="entry-row card-press" @tap="go(item.path)">
        <text class="entry-icon">{{ item.icon }}</text>
        <text class="entry-title">{{ $t(item.titleKey) }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('profileBadges') }}</text>
    </view>
    <view class="badge-grid">
      <view
        v-for="badge in badges"
        :key="badge.name"
        class="badge-card glass-card"
        :class="[badge.tier, { locked: !badge.done }]"
      >
        <view class="badge-icon" :style="{ background: badge.gradient }">
          <text>{{ badge.icon }}</text>
        </view>
        <text class="badge-tier">{{ badge.tierName }}</text>
        <text class="badge-name">{{ badge.name }}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ $t('profileSettings') }}</text>
    </view>
    <view class="entry-list glass-card">
      <view v-for="item in settings" :key="item.titleKey" class="entry-row card-press" @tap="go(item.path)">
        <text class="entry-icon">{{ item.icon }}</text>
        <text class="entry-title">{{ $t(item.titleKey) }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <AppTabBar current="profile" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { learningPaths } from '@/common/mock.js'
import { getAvatarOption, getEquippedFrame, getUserState } from '@/common/userState.js'

export default {
  components: { AppTabBar, KafangAssistant },
  data() {
    const currentUser = getUserState()
    return {
      user: currentUser,
      learningPaths,
      dataStats: [
        { label: '总练习次数', value: '386' },
        { label: '最佳成绩', value: currentUser.best },
        { label: '对战胜率', value: currentUser.winRate },
        { label: '连续打卡', value: `${currentUser.streak} 天` }
      ],
      entries: [
        { titleKey: 'profileShop', icon: '币', path: '/pages/shop/shop' },
        { titleKey: 'profileFavorites', icon: '★', path: '/pages/favorites/favorites' },
        { titleKey: 'profileRecent', icon: '▶', path: '/pages/recent/recent' },
        { titleKey: 'profileMistakes', icon: '!', path: '/pages/mistakes/mistakes' },
        { titleKey: 'profileRecords', icon: '≡', path: '/pages/records/records' }
      ],
      badges: [
        { name: '初学者', icon: '新', tier: 'bronze', tierName: '青铜', gradient: 'linear-gradient(135deg, #cd7f32, #f59e0b)', done: true },
        { name: '白十字入门', icon: '十', tier: 'bronze', tierName: '青铜', gradient: 'linear-gradient(135deg, #f97316, #facc15)', done: true },
        { name: '连续 7 天', icon: '7', tier: 'silver', tierName: '白银', gradient: 'linear-gradient(135deg, #94a3b8, #e2e8f0)', done: true },
        { name: '首次胜利', icon: '胜', tier: 'silver', tierName: '白银', gradient: 'linear-gradient(135deg, #38bdf8, #c4b5fd)', done: true },
        { name: '破 60 秒', icon: '60', tier: 'gold', tierName: '黄金', gradient: 'linear-gradient(135deg, #facc15, #fb7185)', done: true },
        { name: '破 30 秒', icon: '30', tier: 'gold', tierName: '黄金', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', done: false },
        { name: 'F2L 学徒', icon: 'F', tier: 'emerald', tierName: '翡翠', gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)', done: false },
        { name: '公式猎手', icon: 'ƒ', tier: 'emerald', tierName: '翡翠', gradient: 'linear-gradient(135deg, #10b981, #84cc16)', done: false },
        { name: '钻石手速', icon: 'D', tier: 'diamond', tierName: '钻石', gradient: 'linear-gradient(135deg, #22d3ee, #2563eb)', done: false },
        { name: '百战选手', icon: '百', tier: 'diamond', tierName: '钻石', gradient: 'linear-gradient(135deg, #60a5fa, #a855f7)', done: false },
        { name: '赛季冠军', icon: '冠', tier: 'legend', tierName: '传说', gradient: 'linear-gradient(135deg, #ef4444, #f97316, #facc15)', done: false },
        { name: '魔方大师', icon: '王', tier: 'legend', tierName: '传说', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899, #22d3ee)', done: false }
      ],
      settings: [
        { titleKey: 'profileAccount', icon: '账', path: '/pages/settings/settings' },
        { titleKey: 'profileTheme', icon: '色', path: '/pages/theme/theme' },
        { titleKey: 'profileAbout', icon: 'i', path: '/pages/about/about' }
      ]
    }
  },
  computed: {
    avatarOption() {
      return getAvatarOption(this.user.avatarOption)
    },
    avatarGradient() {
      return `linear-gradient(135deg, ${this.avatarOption.colors[0]}, ${this.avatarOption.colors[1]})`
    },
    avatarFrameGradient() {
      const frame = getEquippedFrame(this.user)
      return `conic-gradient(${frame.color}, #ffffff, ${frame.color}, #f97316, ${frame.color})`
    }
  },
  onShow() {
    this.user = getUserState()
    this.dataStats = [
      { label: '总练习次数', value: '386' },
      { label: '最佳成绩', value: this.user.best },
      { label: '对战胜率', value: this.user.winRate },
      { label: '连续打卡', value: `${this.user.streak} 天` }
    ]
  },
  methods: {
    go(path) {
      uni.navigateTo({ url: path })
    }
  }
}
</script>

<style scoped>
.profile-card {
  padding: 28rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.72), rgba(168, 85, 247, 0.58));
  border: 1rpx solid rgba(255, 255, 255, 0.14);
}

.avatar-wrap {
  width: 108rpx;
  height: 108rpx;
  padding: 5rpx;
  border-radius: 50%;
  background: conic-gradient(#22d3ee, #a855f7, #f97316, #22d3ee);
}

.avatar {
  width: 98rpx;
  height: 98rpx;
  border-radius: 50%;
}

.avatar-face {
  width: 98rpx;
  height: 98rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 35.2rpx;
  font-weight: 900;
  box-shadow: inset 0 -8rpx 18rpx rgba(2, 6, 23, 0.22);
}

.avatar-image {
  width: 98rpx;
  height: 98rpx;
  border-radius: 50%;
}

.profile-info {
  min-width: 0;
  flex: 1;
}

.name {
  color: #fff;
  font-size: 37.4rpx;
  font-weight: 900;
}

.level {
  margin-top: 10rpx;
  display: block;
  color: rgba(255, 255, 255, 0.82);
  font-size: 26.4rpx;
}

.data-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
}

.data-card {
  min-width: 0;
  padding: 18rpx 4rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.data-value {
  max-width: 100%;
  overflow: hidden;
  color: var(--app-title);
  font-size: 25.3rpx;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.data-label {
  color: var(--app-text-secondary);
  font-size: 20.9rpx;
}

.progress-card {
  padding: 22rpx;
}

.progress-row + .progress-row {
  margin-top: 22rpx;
}

.progress-copy {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.path-title {
  color: var(--app-text-primary);
  font-size: 27.5rpx;
  font-weight: 800;
}

.path-percent {
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}

.track {
  height: 10rpx;
  margin-top: 12rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: var(--app-muted-panel);
}

.fill {
  height: 100%;
  border-radius: 8rpx;
  background: #22d3ee;
}

.entry-list {
  padding: 6rpx 14rpx;
}

.entry-row {
  height: 82rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  border-bottom: 1rpx solid var(--app-border);
}

.entry-row:last-child {
  border-bottom: 0;
}

.entry-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 24.2rpx;
  font-weight: 900;
  background: #22d3ee;
}

.entry-title {
  flex: 1;
  color: var(--app-title);
  font-size: 28.6rpx;
}

.arrow {
  color: var(--app-text-secondary);
  font-size: 41.8rpx;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.badge-card {
  position: relative;
  min-height: 168rpx;
  padding: 18rpx 8rpx 16rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border-width: 2rpx;
}

.badge-card::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background: currentColor;
}

.badge-card.bronze {
  color: #d97706;
  border-color: rgba(217, 119, 6, 0.32);
}

.badge-card.silver {
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.34);
}

.badge-card.gold {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.36);
}

.badge-card.emerald {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.34);
}

.badge-card.diamond {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.36);
}

.badge-card.legend {
  color: #ec4899;
  border-color: rgba(236, 72, 153, 0.38);
}

.badge-card.locked {
  opacity: 0.58;
  filter: saturate(0.45);
}

.badge-card.locked::after {
  content: "未解锁";
  position: absolute;
  right: 8rpx;
  top: 8rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  color: #64748b;
  font-size: 17.6rpx;
  font-weight: 900;
  background: rgba(148, 163, 184, 0.16);
}

.badge-icon {
  position: relative;
  z-index: 1;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24.2rpx;
  font-weight: 900;
  box-shadow: 0 10rpx 22rpx rgba(2, 6, 23, 0.2);
}

.badge-tier {
  position: relative;
  z-index: 1;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  color: currentColor;
  font-size: 18.7rpx;
  line-height: 24rpx;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.74);
}

.badge-name {
  position: relative;
  z-index: 1;
  max-width: 100%;
  overflow: hidden;
  color: var(--app-text-primary);
  font-size: 22rpx;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
