<template>
  <view class="app-tabbar">
    <view
      v-for="item in tabs"
      :key="item.key"
      class="tab-item"
      :class="{ active: current === item.key }"
      :style="{ '--tab-color': item.color, '--tab-active-bg': item.bg }"
      @tap="go(item)"
    >
      <text class="tab-icon">{{ item.icon }}</text>
      <text class="tab-label">{{ $t(item.labelKey) }}</text>
    </view>
  </view>
</template>

<script>
import { tabItems } from '@/common/mock.js'

export default {
  name: 'AppTabBar',
  props: {
    current: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tabs: tabItems
    }
  },
  methods: {
    go(item) {
      if (item.key === this.current) return
      uni.redirectTo({ url: item.path })
    }
  }
}
</script>

<style scoped>
.app-tabbar {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 80;
  width: 100%;
  max-width: 430px;
  height: calc(116rpx + env(safe-area-inset-bottom));
  padding: 10rpx 18rpx calc(10rpx + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6rpx;
  background: var(--tabbar-game-bg);
  border-top: 1rpx solid var(--tabbar-game-border);
  box-shadow: var(--tabbar-game-shadow);
  backdrop-filter: blur(12px);
  transform: translateX(-50%);
}

.tab-item {
  min-width: 0;
  height: 90rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: var(--tab-color);
  opacity: 0.68;
  transition: transform 0.14s ease, opacity 0.14s ease, background 0.14s ease;
}

.tab-item:active {
  opacity: 0.82;
  transform: scale(0.97);
}

.tab-item.active {
  color: var(--tab-color);
  opacity: 1;
  background: var(--tab-active-bg);
  box-shadow: inset 0 0 0 4rpx color-mix(in srgb, var(--tab-color) 32%, transparent), 0 0 22rpx color-mix(in srgb, var(--tab-color) 18%, transparent);
}

.tab-icon {
  height: 42rpx;
  font-size: 39rpx;
  line-height: 42rpx;
  font-weight: 900;
}

.tab-label {
  max-width: 100%;
  overflow: hidden;
  color: currentColor;
  font-size: 20rpx;
  line-height: 24rpx;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:global(html) {
  --tabbar-game-bg: rgba(5, 10, 24, 0.94);
  --tabbar-game-border: rgba(56, 189, 248, 0.16);
  --tabbar-game-shadow: 0 -8rpx 24rpx rgba(2, 6, 23, 0.32);
}

:global(html[data-theme="light"]),
:global(body[data-theme="light"]) {
  --tabbar-game-bg: rgba(255, 255, 255, 0.96);
  --tabbar-game-border: rgba(15, 23, 42, 0.08);
  --tabbar-game-shadow: 0 -8rpx 24rpx rgba(15, 23, 42, 0.07);
}
</style>
