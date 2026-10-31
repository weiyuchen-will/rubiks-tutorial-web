<template>
  <view class="page-shell battle-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleBattle') }}</text>
      <view class="icon-btn">♕</view>
    </view>

    <view class="player-card glass-card">
      <view class="avatar-wrap" :style="{ background: avatarFrameGradient }">
        <image v-if="user.avatarImage" class="avatar-image" :src="user.avatarImage" mode="aspectFill" />
        <view v-else class="avatar-face" :style="{ background: avatarGradient }">
          <text>{{ avatarOption.icon }}</text>
        </view>
      </view>
      <view class="player-info">
        <text class="name ellipsis">{{ user.name }}</text>
        <text class="muted">Lv.{{ user.level }} · {{ user.points }} 积分 · 胜率 {{ user.winRate }}</text>
      </view>
    </view>

    <KafangAssistant :message="battleAssistantMessage" :mood="selectedBot ? 'go' : 'cocky'" tone="orange" voice-pack="battle" />

    <view class="section-head">
      <text class="section-title">对战模式</text>
    </view>
    <view class="mode-grid">
      <view v-for="mode in modes" :key="mode.key" class="mode-card glass-card card-press" :class="{ active: battleMode === mode.key, disabled: !mode.open }" @tap="selectMode(mode)">
        <text class="mode-icon">{{ mode.icon }}</text>
        <text class="mode-title">{{ mode.title }}</text>
        <text class="mode-sub">{{ mode.open ? '立即匹配' : '即将开放' }}</text>
      </view>
    </view>

    <scroll-view scroll-x class="cube-scroll" :show-scrollbar="false">
      <view class="cube-row">
        <view v-for="item in cubeTypes" :key="item" class="chip pressable" :class="{ active: cubeType === item }" @tap="cubeType = item">{{ item }}</view>
      </view>
    </scroll-view>

    <view class="section-head">
      <text class="section-title">AI 对手</text>
    </view>
    <view class="bot-list">
      <view v-for="bot in bots" :key="bot.id" class="bot-card glass-card card-press" :class="{ selected: selectedBot === bot.id }" @tap="selectedBot = bot.id">
        <view class="bot-avatar">{{ bot.name.slice(0, 1) }}</view>
        <view class="bot-info">
          <text class="bot-name">{{ bot.name }}</text>
          <text class="bot-meta">{{ bot.points }} 积分 · 预计 {{ bot.range }}</text>
        </view>
        <text class="diff" :style="{ color: bot.color, borderColor: bot.color }">{{ bot.diff }}</text>
      </view>
    </view>

    <view class="start-battle pressable" :class="{ disabled: !selectedBot }" @tap="startBattle">开始对战</view>

    <view class="section-head">
      <text class="section-title">最近对战</text>
    </view>
    <view class="record-card glass-card">
      <view v-for="item in battleRecords" :key="item.id" class="record-row card-press" @tap="goResult(item.id)">
        <text class="result" :class="{ win: item.result === '胜利', lose: item.result === '失败' }">{{ item.result }}</text>
        <text class="opponent ellipsis">{{ item.opponent }}</text>
        <text class="score mono">{{ item.score }}</text>
        <text class="point" :class="{ win: item.point.indexOf('+') === 0, lose: item.point.indexOf('-') === 0 }">{{ item.point }}</text>
      </view>
    </view>

    <AppTabBar current="battle" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { battleRecords, bots } from '@/common/mock.js'
import { getAvatarOption, getEquippedFrame, getUserState } from '@/common/userState.js'

export default {
  components: { AppTabBar, KafangAssistant },
  data() {
    return {
      user: getUserState(),
      bots,
      battleRecords,
      battleMode: 'ai',
      selectedBot: '',
      cubeType: '3x3',
      cubeTypes: ['2x2', '3x3', '4x4', '5x5'],
      modes: [
        { key: 'ai', title: 'AI 对战', icon: 'AI', open: true },
        { key: 'friend', title: '好友对战', icon: '双', open: false },
        { key: 'rank', title: '排位赛', icon: '段', open: false }
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
      return `conic-gradient(${frame.color}, #fff, ${frame.color}, #f97316, ${frame.color})`
    },
    battleAssistantMessage() {
      const bot = this.bots.find(item => item.id === this.selectedBot)
      if (bot) return `锁定 ${bot.name}，我负责喊开始，你负责赢。`
      return '先挑个 AI 对手，别让我一个方块在这装狠。'
    }
  },
  onShow() {
    this.user = getUserState()
  },
  methods: {
    back() {
      uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/home/home' }) })
    },
    selectMode(mode) {
      if (!mode.open) {
        uni.showToast({ title: '即将开放', icon: 'none' })
        return
      }
      this.battleMode = mode.key
    },
    startBattle() {
      if (!this.selectedBot) return
      uni.navigateTo({ url: `/pages/battle-room/battle-room?botId=${this.selectedBot}&cubeType=${this.cubeType}` })
    },
    goResult(id) {
      uni.navigateTo({ url: `/pages/battle-result/battle-result?battleId=${id}` })
    }
  }
}
</script>

<style scoped>
.battle-page {
  padding-bottom: calc(154rpx + env(safe-area-inset-bottom));
}

.player-card {
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.avatar-wrap {
  width: 94rpx;
  height: 94rpx;
  padding: 5rpx;
  border-radius: 50%;
}

.avatar-face {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30.8rpx;
  font-weight: 900;
}

.avatar-image {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
}

.player-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.name {
  color: var(--app-title);
  font-size: 34.1rpx;
  font-weight: 900;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.mode-card {
  min-width: 0;
  height: 142rpx;
  padding: 18rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.mode-card.active {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.11);
}

.mode-card.disabled {
  opacity: 0.62;
}

.mode-icon {
  color: #22d3ee;
  font-size: 28.6rpx;
  font-weight: 900;
}

.mode-title {
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 800;
}

.mode-sub {
  color: var(--app-text-secondary);
  font-size: 22rpx;
}

.cube-row {
  width: max-content;
  padding: 24rpx 0 0;
  display: flex;
  gap: 14rpx;
}

.bot-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.bot-card {
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.bot-card.selected {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.1);
}

.bot-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 30.8rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #22d3ee, #a855f7);
}

.bot-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.bot-name {
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 800;
}

.bot-meta {
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
}

.diff {
  padding: 5rpx 12rpx;
  border: 1rpx solid;
  border-radius: 8rpx;
  font-size: 23.1rpx;
}

.start-battle {
  height: 86rpx;
  margin-top: 22rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 33rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
}

.start-battle.disabled {
  color: var(--app-text-secondary);
  background: var(--app-muted-panel);
}

.record-card {
  padding: 6rpx 16rpx;
}

.record-row {
  height: 74rpx;
  display: grid;
  grid-template-columns: 78rpx 1fr 128rpx 64rpx;
  align-items: center;
  gap: 10rpx;
  border-bottom: 1rpx solid var(--app-border);
}

.record-row:last-child {
  border-bottom: 0;
}

.result,
.point {
  font-size: 25.3rpx;
  font-weight: 900;
}

.win {
  color: #22c55e;
}

.lose {
  color: #ef4444;
}

.opponent {
  color: var(--app-text-primary);
  font-size: 26.4rpx;
}

.score {
  color: var(--app-chip-text);
  font-size: 25.3rpx;
}
</style>
