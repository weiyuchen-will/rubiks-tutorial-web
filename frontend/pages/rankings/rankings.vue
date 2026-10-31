<template>
  <view class="page-shell rank-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleRankings') }}</text>
      <view class="icon-btn">🏁</view>
    </view>

    <view class="tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="tab.key"
        class="tab pressable"
        :class="{ active: currentTab === tab.key }"
        @tap="currentTab = tab.key"
      >
        {{ $t(tab.labelKey) }}
      </view>
      <view class="tab-underline" :style="{ transform: `translateX(${underlineX}%)` }" />
    </view>

    <KafangAssistant :message="assistantMessage" mood="go" tone="cyan" voice-pack="cheer" />

    <view class="season-card glass-card">
      <view class="season-copy">
        <text class="season-kicker">第 {{ season.seasonNo }} 届 · {{ season.currentLeague }}</text>
        <text class="season-title">每周前 {{ season.promoteCount }} 名进入下一届排行榜</text>
        <text class="season-desc">{{ season.deadline }} 结算，晋级到第 {{ season.nextSeasonNo }} 届 · {{ season.nextLeague }}</text>
      </view>
      <view class="league-stack">
        <view
          v-for="item in season.levels"
          :key="item.name"
          class="league-chip"
          :class="{ active: item.active }"
          :style="{ borderColor: item.color }"
        >
          <text class="league-dot" :style="{ background: item.color }" />
          <text class="league-name ellipsis">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="reward-card glass-card">
      <view class="reward-head">
        <view>
          <text class="reward-kicker">晋级奖励</text>
          <text class="reward-title">段位越高，奖励越丰富</text>
        </view>
        <text class="reward-status">{{ isPromoted(myRank) ? '待领取' : '冲前五' }}</text>
      </view>
      <view class="current-reward">
        <text class="current-reward-label">本周晋级可得</text>
        <text class="current-reward-value">+{{ currentReward.points }} 积分 · +{{ currentReward.coins }} 金币</text>
        <text class="current-reward-prize">{{ currentReward.prize }}</text>
      </view>
      <scroll-view scroll-x class="reward-scroll" :show-scrollbar="false">
        <view class="reward-row">
          <view
            v-for="item in season.rewards"
            :key="item.to"
            class="reward-tier"
            :class="{ active: item.from === season.currentLeague }"
            :style="{ borderColor: item.color }"
          >
            <text class="tier-name ellipsis">{{ item.to }}</text>
            <text class="tier-coins">+{{ item.coins }} 金币</text>
            <text class="tier-points">+{{ item.points }} 积分</text>
            <text class="tier-prize ellipsis">{{ item.prize }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="promotion-panel">
      <view class="promotion-head">
        <text class="promotion-title">本周晋级区</text>
        <text class="promotion-rule">Top {{ season.promoteCount }}</text>
      </view>
      <view class="promotion-cubes">
        <view
          v-for="item in promotionUsers"
          :key="item.id"
          class="promotion-cube card-press"
          :class="{ me: item.me }"
          @tap="openUser(item.id)"
        >
          <text class="cube-rank">#{{ item.rank }}</text>
          <text class="cube-name ellipsis">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="podium-head">
      <text class="section-title">{{ $t('rankingTop3') }}</text>
      <text class="muted">{{ metricTitle }}</text>
    </view>

    <view class="podium">
      <view class="podium-item second promoted card-press" @tap="openUser(board[1].id)">
        <text class="promote-badge">晋级</text>
        <view class="podium-rank silver">2</view>
        <image class="podium-avatar" :src="board[1].avatar" />
        <text class="podium-name ellipsis">{{ board[1].name }}</text>
        <text class="podium-level">Lv.{{ board[1].level }}</text>
        <text class="podium-value">{{ board[1].value }}</text>
      </view>
      <view class="podium-item first promoted card-press" @tap="openUser(board[0].id)">
        <text class="promote-badge gold-badge">直升</text>
        <view class="podium-rank gold">1</view>
        <image class="podium-avatar big" :src="board[0].avatar" />
        <text class="podium-name ellipsis">{{ board[0].name }}</text>
        <text class="podium-level">Lv.{{ board[0].level }}</text>
        <text class="podium-value">{{ board[0].value }}</text>
      </view>
      <view class="podium-item third promoted card-press" @tap="openUser(board[2].id)">
        <text class="promote-badge">晋级</text>
        <view class="podium-rank bronze">3</view>
        <image class="podium-avatar" :src="board[2].avatar" />
        <text class="podium-name ellipsis">{{ board[2].name }}</text>
        <text class="podium-level">Lv.{{ board[2].level }}</text>
        <text class="podium-value">{{ board[2].value }}</text>
      </view>
    </view>

    <view class="my-rank glass-card card-press" @tap="goProfile">
      <view class="my-rank-row">
        <text class="my-title">{{ $t('rankingMyRank') }} #{{ myRank.rank }}</text>
        <text class="my-tag" :class="{ win: isPromoted(myRank) }">{{ isPromoted(myRank) ? '晋级区' : metricTitle }}</text>
      </view>
      <text class="my-promotion">{{ myPromotionText }}</text>
      <text class="my-gap">{{ gapText }}</text>
    </view>

    <view class="rank-list glass-card">
      <view
        v-for="item in restUsers"
        :key="item.id"
        class="rank-row card-press"
        :class="{ me: item.me, promoted: isPromoted(item) }"
        @tap="openUser(item.id)"
      >
        <text class="rank-no">#{{ item.rank }}</text>
        <image class="avatar" :src="item.avatar" />
        <view class="info">
          <text class="name ellipsis">{{ item.name }}</text>
          <text class="level">Lv.{{ item.level }}</text>
        </view>
        <text v-if="isPromoted(item)" class="row-badge">晋级</text>
        <text class="value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { rankingBoards, rankingSeason } from '@/common/mock.js'
import { getUserState } from '@/common/userState.js'

export default {
  components: { KafangAssistant },
  data() {
    return {
      currentTab: 'score',
      season: rankingSeason,
      currentUser: getUserState(),
      tabs: [
        { key: 'score', labelKey: 'rankingScore' },
        { key: 'speed', labelKey: 'rankingSpeed' },
        { key: 'winRate', labelKey: 'rankingWinRate' },
        { key: 'practice', labelKey: 'rankingPractice' },
        { key: 'streak', labelKey: 'rankingStreak' }
      ]
    }
  },
  computed: {
    board() {
      const board = rankingBoards[this.currentTab] || rankingBoards.score
      if (this.currentTab !== 'streak') return board
      return board
        .map(item => item.me ? { ...item, value: `${this.currentUser.streak || 0} 天` } : { ...item })
        .sort((a, b) => this.valueNumber(b.value) - this.valueNumber(a.value))
        .map((item, index) => ({ ...item, rank: index + 1 }))
    },
    topThree() {
      return this.board.slice(0, 3)
    },
    restUsers() {
      return this.board.slice(3)
    },
    promotionUsers() {
      return this.board.slice(0, this.season.promoteCount)
    },
    myRank() {
      return this.board.find(item => item.me) || this.board[0]
    },
    currentReward() {
      return this.season.rewards.find(item => item.from === this.season.currentLeague) || this.season.rewards[0]
    },
    assistantMessage() {
      if (this.isPromoted(this.myRank)) {
        return `你现在是 #${this.myRank.rank}，在前五晋级区！周日结算还能拿 ${this.currentReward.coins} 金币。`
      }
      return `你现在是 #${this.myRank.rank}，再追 ${this.myPromotionGap} 名就能挤进晋级区。`
    },
    myPromotionGap() {
      const promoteLine = this.season.promoteCount
      return Math.max(0, this.myRank.rank - promoteLine)
    },
    myPromotionText() {
      if (this.isPromoted(this.myRank)) {
        return `本周保持前 ${this.season.promoteCount}，即可进入第 ${this.season.nextSeasonNo} 届 · ${this.season.nextLeague}`
      }
      return `距离第 ${this.season.nextSeasonNo} 届晋级区还差 ${this.myPromotionGap} 名`
    },
    metricTitle() {
      return this.$t(this.tabs.find(item => item.key === this.currentTab)?.labelKey || 'rankingScore')
    },
    underlineX() {
      const index = this.tabs.findIndex(item => item.key === this.currentTab)
      return index * 100
    },
    gapText() {
      const index = this.board.findIndex(item => item.me)
      const current = this.board[index]
      const previous = this.board[index - 1]
      const next = this.board[index + 1]
      if (!current || !previous) {
        if (!current) return ''
        if (!next) return `${this.$t('rankingCurrentUser')} · ${current.value}`
        const diff = this.diffValue(current.value, next.value)
        const leadKeyMap = {
          score: 'rankingLeadScore',
          speed: 'rankingLeadSpeed',
          winRate: 'rankingLeadWinRate',
          practice: 'rankingLeadPractice',
          streak: 'rankingLeadStreak'
        }
        return this.$t(leadKeyMap[this.currentTab], { value: diff })
      }
      const gapKeyMap = {
        score: 'rankingBehindScore',
        speed: 'rankingBehindSpeed',
        winRate: 'rankingBehindWinRate',
        practice: 'rankingBehindPractice',
        streak: 'rankingBehindStreak'
      }
      return this.$t(gapKeyMap[this.currentTab], { value: this.diffValue(previous.value, current.value) })
    }
  },
  onShow() {
    this.currentUser = getUserState()
  },
  methods: {
    back() {
      uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/home/home' }) })
    },
    openUser(id) {
      uni.navigateTo({ url: `/pages/user-detail/user-detail?userId=${id}` })
    },
    goProfile() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    },
    isPromoted(item) {
      return item && item.rank <= this.season.promoteCount
    },
    diffValue(a, b) {
      const left = this.valueNumber(a)
      const right = this.valueNumber(b)
      if (Number.isNaN(left) || Number.isNaN(right)) return 0
      const diff = Math.abs(left - right)
      return diff % 1 === 0 ? diff.toFixed(0) : diff.toFixed(2)
    },
    valueNumber(value) {
      return parseFloat(String(value).replace(/[^0-9.]/g, ''))
    }
  }
}
</script>

<style scoped>
.rank-page {
  padding-bottom: 54rpx;
}

.tabs {
  position: relative;
  height: 80rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1rpx solid var(--app-border);
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
}

.tab.active {
  color: #22d3ee;
  font-weight: 900;
}

.tab-underline {
  position: absolute;
  bottom: -1rpx;
  left: 0;
  width: 20%;
  height: 4rpx;
  border-radius: 8rpx;
  background: #22d3ee;
  transition: transform 0.18s ease;
}

.season-card {
  margin-top: 22rpx;
  padding: 22rpx;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18rpx;
  overflow: hidden;
  border-color: rgba(34, 211, 238, 0.28);
  background:
    linear-gradient(135deg, rgba(34, 211, 238, 0.14), rgba(168, 85, 247, 0.08)),
    var(--app-surface);
}

.season-copy {
  min-width: 0;
}

.season-kicker {
  display: block;
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 900;
}

.season-title {
  margin-top: 10rpx;
  display: block;
  color: var(--app-title);
  font-size: 35.2rpx;
  line-height: 46.2rpx;
  font-weight: 900;
}

.season-desc {
  margin-top: 10rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
  line-height: 37.4rpx;
}

.league-stack {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8rpx;
}

.league-chip {
  min-width: 0;
  height: 42rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: var(--app-text-secondary);
  font-size: 19.8rpx;
  border: 1rpx solid;
  background: rgba(2, 6, 23, 0.16);
}

.league-chip.active {
  color: var(--app-title);
  background: rgba(34, 211, 238, 0.12);
}

.league-dot {
  width: 10rpx;
  height: 10rpx;
  flex: 0 0 10rpx;
  border-radius: 50%;
}

.league-name {
  min-width: 0;
}

.promotion-panel {
  margin-top: 18rpx;
}

.promotion-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.promotion-title {
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 900;
}

.promotion-rule {
  color: #facc15;
  font-size: 24.2rpx;
  font-weight: 900;
}

.promotion-cubes {
  margin-top: 14rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10rpx;
}

.promotion-cube {
  min-width: 0;
  min-height: 98rpx;
  padding: 10rpx 6rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(34, 211, 238, 0.1);
  border: 1rpx solid rgba(34, 211, 238, 0.25);
}

.promotion-cube.me {
  background: rgba(250, 204, 21, 0.12);
  border-color: #facc15;
}

.cube-rank {
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 900;
}

.cube-name {
  max-width: 100%;
  margin-top: 8rpx;
  color: var(--app-title);
  font-size: 20.9rpx;
  font-weight: 800;
}

.reward-card {
  margin-top: 18rpx;
  padding: 20rpx;
  overflow: hidden;
  border-color: rgba(250, 204, 21, 0.24);
}

.reward-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.reward-kicker {
  display: block;
  color: #facc15;
  font-size: 24.2rpx;
  font-weight: 900;
}

.reward-title {
  margin-top: 8rpx;
  display: block;
  color: var(--app-title);
  font-size: 31.9rpx;
  line-height: 41.8rpx;
  font-weight: 900;
}

.reward-status {
  flex: 0 0 auto;
  padding: 7rpx 14rpx;
  border-radius: 8rpx;
  color: #020617;
  font-size: 22rpx;
  font-weight: 900;
  background: #facc15;
}

.current-reward {
  margin-top: 16rpx;
  padding: 16rpx;
  border-radius: 8rpx;
  background: rgba(250, 204, 21, 0.1);
  border: 1rpx solid rgba(250, 204, 21, 0.22);
}

.current-reward-label {
  display: block;
  color: var(--app-text-secondary);
  font-size: 23.1rpx;
}

.current-reward-value {
  margin-top: 7rpx;
  display: block;
  color: #facc15;
  font-size: 30.8rpx;
  line-height: 39.6rpx;
  font-weight: 900;
}

.current-reward-prize {
  margin-top: 7rpx;
  display: block;
  color: var(--app-title);
  font-size: 25.3rpx;
  line-height: 35.2rpx;
  font-weight: 800;
}

.reward-scroll {
  margin-top: 16rpx;
  white-space: nowrap;
}

.reward-row {
  width: max-content;
  display: flex;
  gap: 12rpx;
}

.reward-tier {
  width: 214rpx;
  min-height: 146rpx;
  padding: 16rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--app-muted-panel);
  border: 1rpx solid;
}

.reward-tier.active {
  background: rgba(34, 211, 238, 0.1);
}

.tier-name {
  color: var(--app-title);
  font-size: 25.3rpx;
  font-weight: 900;
}

.tier-coins {
  margin-top: 10rpx;
  color: #facc15;
  font-size: 24.2rpx;
  font-weight: 900;
}

.tier-points {
  margin-top: 5rpx;
  color: #22d3ee;
  font-size: 23.1rpx;
  font-weight: 800;
}

.tier-prize {
  margin-top: 7rpx;
  color: var(--app-text-secondary);
  font-size: 20.9rpx;
}

.podium-head {
  margin-top: 26rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.podium {
  height: 332rpx;
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 12rpx;
}

.podium-item {
  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: 20rpx 10rpx 16rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: var(--app-surface);
  border: 1rpx solid var(--app-border);
  box-shadow: var(--app-card-shadow);
}

.podium-item.promoted {
  border-color: rgba(34, 211, 238, 0.32);
}

.promote-badge {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  color: #020617;
  font-size: 19.8rpx;
  font-weight: 900;
  background: #22d3ee;
}

.gold-badge {
  background: #facc15;
}

.first {
  min-height: 304rpx;
}

.second {
  min-height: 258rpx;
}

.third {
  min-height: 238rpx;
}

.podium-rank {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 24.2rpx;
  font-weight: 900;
}

.gold {
  background: #facc15;
}

.silver {
  background: #cbd5e1;
}

.bronze {
  background: #b45309;
}

.podium-avatar {
  width: 72rpx;
  height: 72rpx;
  margin-top: 12rpx;
  border-radius: 50%;
}

.podium-avatar.big {
  width: 92rpx;
  height: 92rpx;
}

.podium-name {
  max-width: 100%;
  margin-top: 10rpx;
  color: var(--app-title);
  font-size: 26.4rpx;
  font-weight: 800;
}

.podium-level {
  margin-top: 6rpx;
  color: var(--app-text-secondary);
  font-size: 22rpx;
}

.podium-value {
  margin-top: 8rpx;
  color: #22d3ee;
  font-size: 28.6rpx;
  font-weight: 900;
}

.my-rank {
  margin: 24rpx 0;
  padding: 22rpx;
  border-color: #22d3ee;
}

.my-rank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.my-title {
  color: var(--app-title);
  font-size: 30.8rpx;
  font-weight: 900;
}

.my-tag {
  color: #22d3ee;
  font-size: 24.2rpx;
}

.my-tag.win {
  color: #22c55e;
}

.my-gap {
  margin-top: 8rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 25.3rpx;
}

.my-promotion {
  margin-top: 12rpx;
  display: block;
  color: #22d3ee;
  font-size: 26.4rpx;
  line-height: 37.4rpx;
  font-weight: 800;
}

.rank-list {
  padding: 8rpx 14rpx;
}

.rank-row {
  height: 84rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.rank-row.me {
  border: 1rpx solid #22d3ee;
  background: rgba(34, 211, 238, 0.08);
}

.rank-row.promoted:not(.me) {
  background: rgba(34, 211, 238, 0.06);
}

.rank-no {
  width: 58rpx;
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}

.avatar {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
}

.info {
  min-width: 0;
  flex: 1;
}

.name {
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 800;
}

.level {
  margin-top: 4rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 22rpx;
}

.value {
  flex: 0 0 auto;
  color: var(--app-title);
  font-size: 27.5rpx;
  font-weight: 900;
}

.row-badge {
  flex: 0 0 auto;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  color: #020617;
  font-size: 19.8rpx;
  font-weight: 900;
  background: #22d3ee;
}
</style>
