<template>
  <view class="page-shell shop-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleShop') }}</text>
      <view class="wallet-pills">
        <view class="coin-pill">
          <text class="coin-dot">●</text>
          <text>{{ coins }}</text>
        </view>
        <view class="coin-pill point-pill">
          <text class="point-dot">◆</text>
          <text>{{ points }}</text>
        </view>
      </view>
    </view>

    <view class="shop-hero glass-card">
      <view class="hero-copy">
        <text class="hero-title">{{ $t('shopHeroTitle') }}</text>
        <text class="hero-sub">{{ $t('shopHeroSub') }}</text>
      </view>
      <view class="hero-cube">
        <view v-for="(color, idx) in cubeColors" :key="idx" :style="{ background: color }" />
      </view>
    </view>

    <KafangAssistant message="金币别乱花，先换能让训练变帅的东西。" mood="cocky" tone="orange" voice-pack="shop" />

    <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
      <view class="category-row">
        <view
          v-for="item in categories"
          :key="item.value"
          class="chip pressable"
          :class="{ active: category === item.value }"
          @tap="category = item.value"
        >
          {{ $t(item.labelKey) }}
        </view>
      </view>
    </scroll-view>

    <view class="section-head">
      <text class="section-title">{{ $t('shopProducts') }}</text>
      <text class="muted">{{ filteredProducts.length }} 件</text>
    </view>

    <view class="product-grid">
      <view v-for="item in filteredProducts" :key="item.id" class="product-card glass-card card-press">
        <view class="product-visual" :style="{ background: `linear-gradient(135deg, ${item.color}, rgba(15, 23, 42, 0.2))` }">
          <text class="product-tag">{{ item.tag }}</text>
          <view class="mini-cube">
            <view v-for="(color, idx) in cubeColors.slice(0, 6)" :key="idx" :style="{ background: idx % 2 ? item.color : color }" />
          </view>
        </view>
        <view class="product-info">
          <text class="product-name ellipsis">{{ item.name }}</text>
          <text class="product-desc line-clamp-2">{{ item.desc }}</text>
          <text v-if="item.consumable" class="item-count">已拥有 {{ itemCount(item) }} 个</text>
          <view class="buy-row">
            <text class="price">{{ item.price }} {{ priceUnit(item) }}</text>
            <view class="buy-btn pressable" :class="{ disabled: !canBuy(item), equipped: isEquipped(item) }" @tap="buy(item)">
              {{ buttonText(item) }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <AppTabBar current="shop" />
  </view>
</template>

<script>
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue'
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { cubeColors, shopProducts } from '@/common/mock.js'
import { buyProduct, equipFrame, getUserState } from '@/common/userState.js'

export default {
  components: { AppTabBar, KafangAssistant },
  data() {
    const user = getUserState()
    return {
      coins: user.coins,
      user,
      points: user.points,
      category: '全部',
      categories: [
        { label: '全部', labelKey: 'shopAll', value: '全部' },
        { label: '头像框', labelKey: 'shopAvatarFrame', value: '头像框' },
        { label: '课程包', labelKey: 'shopCoursePack', value: '课程包' },
        { label: '道具', labelKey: 'shopItem', value: '道具' }
      ],
      cubeColors,
      products: shopProducts
    }
  },
  onShow() {
    this.user = getUserState()
    this.coins = this.user.coins
    this.points = this.user.points
  },
  computed: {
    filteredProducts() {
      return this.category === '全部'
        ? this.products
        : this.products.filter(item => item.category === this.category)
    }
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    },
    isOwned(item) {
      if (item.consumable) return false
      return this.user.ownedProducts.includes(item.id)
    },
    isEquipped(item) {
      return item.category === '头像框' && this.user.equippedFrame === item.id
    },
    canBuy(item) {
      return this.isOwned(item) || this.walletValue(item) >= item.price
    },
    buttonText(item) {
      if (this.isEquipped(item)) return '使用中'
      if (this.isOwned(item)) return item.category === '头像框' ? '装备' : '已拥有'
      return this.walletValue(item) >= item.price ? this.$t('shopBuy') : this.$t('shopInsufficient')
    },
    priceUnit(item) {
      return item.currency === 'points' ? '积分' : this.$t('shopCoins')
    },
    walletValue(item) {
      return item.currency === 'points' ? this.points : this.coins
    },
    itemCount(item) {
      return this.user.itemCounts?.[item.id] || 0
    },
    buy(item) {
      if (this.isOwned(item)) {
        if (item.category === '头像框') {
          this.user = equipFrame(item.id)
          this.coins = this.user.coins
          uni.showToast({ title: '头像框已装备', icon: 'none' })
        }
        return
      }
      const result = buyProduct(item)
      if (!result.ok) {
        uni.showToast({ title: result.reason === 'points' ? '积分不足' : this.$t('shopNotEnough'), icon: 'none' })
        return
      }
      this.user = result.state
      this.coins = this.user.coins
      this.points = this.user.points
      uni.showToast({ title: item.category === '头像框' ? '已兑换并装备' : this.$t('shopSuccess'), icon: 'none' })
    }
  }
}
</script>

<style scoped>
.shop-page {
  padding-bottom: calc(154rpx + env(safe-area-inset-bottom));
}

.wallet-pills {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.coin-pill {
  height: 58rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: var(--app-title);
  font-size: 26.4rpx;
  font-weight: 900;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.coin-dot {
  color: #facc15;
  font-size: 22rpx;
}

.point-pill {
  color: #dbeafe;
}

.point-dot {
  color: #38bdf8;
  font-size: 19.8rpx;
}

.shop-hero {
  min-height: 188rpx;
  padding: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(34, 211, 238, 0.08)),
    var(--app-surface);
}

.hero-copy {
  min-width: 0;
  width: 68%;
}

.hero-title {
  color: var(--app-title);
  font-size: 37.4rpx;
  font-weight: 900;
}

.hero-sub {
  margin-top: 12rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 26.4rpx;
  line-height: 39.6rpx;
}

.hero-cube {
  width: 114rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6rpx;
  transform: rotate(9deg);
}

.hero-cube view {
  aspect-ratio: 1;
  border-radius: 5rpx;
}

.category-row {
  width: max-content;
  padding: 24rpx 0 0;
  display: flex;
  gap: 14rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.product-card {
  min-width: 0;
  overflow: hidden;
}

.product-visual {
  position: relative;
  height: 148rpx;
  padding: 16rpx;
}

.product-tag {
  height: 36rpx;
  padding: 0 12rpx;
  border-radius: 8rpx;
  display: inline-flex;
  align-items: center;
  color: #020617;
  font-size: 22rpx;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.82);
}

.mini-cube {
  position: absolute;
  right: 18rpx;
  bottom: 16rpx;
  width: 76rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5rpx;
}

.mini-cube view {
  aspect-ratio: 1;
  border-radius: 4rpx;
}

.product-info {
  padding: 18rpx;
}

.product-name {
  color: var(--app-title);
  font-size: 29.7rpx;
  font-weight: 900;
}

.product-desc {
  min-height: 64rpx;
  margin-top: 10rpx;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
  line-height: 35.2rpx;
}

.item-count {
  margin-top: 8rpx;
  display: block;
  color: #38bdf8;
  font-size: 23.1rpx;
  font-weight: 800;
}

.buy-row {
  margin-top: 14rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
}

.price {
  min-width: 0;
  color: #facc15;
  font-size: 24.2rpx;
  font-weight: 900;
}

.buy-btn {
  width: 86rpx;
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

.buy-btn.disabled {
  color: var(--app-text-secondary);
  background: var(--app-muted-panel);
}

.buy-btn.equipped {
  background: #22c55e;
}
</style>
