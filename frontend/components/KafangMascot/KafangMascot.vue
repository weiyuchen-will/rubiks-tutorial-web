<template>
  <view class="kafang" :class="[size, mood, { speaking, blinking }]">
    <view class="axis">
      <view class="axis-dot" />
    </view>
    <view class="body">
      <view v-for="(color, index) in cells" :key="index" class="cell" :style="{ background: color }" />
      <view class="face">
        <view class="brow brow-left" />
        <view class="brow brow-right" />
        <view class="eye eye-left">
          <view class="pupil" />
        </view>
        <view class="eye eye-right goggle">
          <view class="pupil" />
        </view>
        <view class="mouth" />
      </view>
      <view class="cheek cheek-left" />
      <view class="cheek cheek-right" />
    </view>
    <view class="hand hand-left" />
    <view class="hand hand-right" />
    <view class="foot foot-left" />
    <view class="foot foot-right" />
    <text v-if="showName" class="name">咔方</text>
  </view>
</template>

<script>
export default {
  name: 'KafangMascot',
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    mood: {
      type: String,
      default: 'cocky'
    },
    speaking: {
      type: Boolean,
      default: false
    },
    blinking: {
      type: Boolean,
      default: true
    },
    showName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cells: [
        '#22d3ee', '#facc15', '#ef4444',
        '#ffffff', '#38bdf8', '#22c55e',
        '#2563eb', '#f97316', '#a855f7'
      ]
    }
  }
}
</script>

<style scoped>
.kafang {
  position: relative;
  width: 168rpx;
  height: 202rpx;
  transform-origin: 50% 78%;
  animation: kafang-bob 2.8s ease-in-out infinite;
}

.kafang.home {
  width: 188rpx;
  height: 218rpx;
}

.kafang.tiny {
  width: 54rpx;
  height: 62rpx;
  animation-duration: 2.2s;
}

.axis {
  position: absolute;
  left: 50%;
  top: 0;
  z-index: 2;
  width: 34rpx;
  height: 26rpx;
  border-radius: 8rpx 8rpx 4rpx 4rpx;
  background: linear-gradient(180deg, #e0f2fe, #22d3ee);
  border: 2rpx solid rgba(2, 6, 23, 0.18);
  transform: translateX(-50%) rotate(-8deg);
}

.axis-dot {
  width: 10rpx;
  height: 10rpx;
  margin: 7rpx auto 0;
  border-radius: 50%;
  background: #0f172a;
}

.body {
  position: absolute;
  left: 50%;
  top: 22rpx;
  z-index: 3;
  width: 150rpx;
  height: 150rpx;
  padding: 8rpx;
  border-radius: 18rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5rpx;
  background: #0f172a;
  border: 4rpx solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 18rpx 28rpx rgba(2, 6, 23, 0.22);
  transform: translateX(-50%) rotate(-4deg);
  overflow: hidden;
}

.cell {
  border-radius: 7rpx;
  box-shadow: inset 0 -4rpx 0 rgba(2, 6, 23, 0.16);
}

.face {
  position: absolute;
  inset: 22rpx 16rpx 28rpx;
  z-index: 5;
  animation: face-look 4.2s ease-in-out infinite;
}

.brow {
  position: absolute;
  top: 8rpx;
  width: 34rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #07111f;
  transition: transform 0.18s ease;
}

.brow-left {
  left: 22rpx;
  transform: rotate(-16deg);
}

.brow-right {
  right: 16rpx;
  transform: rotate(14deg);
}

.eye {
  position: absolute;
  top: 24rpx;
  width: 32rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #fff;
  border: 3rpx solid #07111f;
  transform-origin: center;
  overflow: hidden;
}

.blinking .eye {
  animation: eye-blink 4.6s infinite;
}

.eye-left {
  left: 24rpx;
}

.eye-right {
  right: 19rpx;
}

.goggle {
  box-shadow: 0 0 0 6rpx rgba(34, 211, 238, 0.7);
}

.pupil {
  width: 12rpx;
  height: 16rpx;
  margin: 10rpx 0 0 12rpx;
  border-radius: 50%;
  background: #07111f;
  animation: pupil-dart 3.8s ease-in-out infinite;
}

.mouth {
  position: absolute;
  left: 47rpx;
  top: 72rpx;
  width: 44rpx;
  height: 23rpx;
  border: 5rpx solid #07111f;
  border-top: 0;
  border-radius: 0 0 32rpx 32rpx;
  transform: rotate(-4deg);
  transition: all 0.16s ease;
}

.cheek {
  position: absolute;
  z-index: 4;
  bottom: 34rpx;
  width: 18rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: rgba(239, 68, 68, 0.38);
}

.cheek-left {
  left: 24rpx;
}

.cheek-right {
  right: 24rpx;
}

.hand,
.foot {
  position: absolute;
  z-index: 2;
  border-radius: 8rpx;
  background: #facc15;
  border: 3rpx solid rgba(2, 6, 23, 0.18);
}

.hand {
  top: 78rpx;
  width: 30rpx;
  height: 24rpx;
}

.hand-left {
  left: 0;
  transform: rotate(-22deg);
}

.hand-right {
  right: 0;
  background: #ef4444;
  transform: rotate(24deg);
}

.foot {
  bottom: 18rpx;
  width: 32rpx;
  height: 22rpx;
  background: #22c55e;
}

.foot-left {
  left: 42rpx;
  transform: rotate(8deg);
}

.foot-right {
  right: 40rpx;
  background: #2563eb;
  transform: rotate(-8deg);
}

.name {
  position: absolute;
  left: 50%;
  bottom: -2rpx;
  z-index: 4;
  min-width: 78rpx;
  height: 34rpx;
  padding: 0 12rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #08111f;
  font-size: 24.2rpx;
  font-weight: 900;
  background: #fff;
  transform: translateX(-50%) rotate(-2deg);
}

.cocky .mouth {
  width: 38rpx;
  height: 18rpx;
  transform: rotate(-10deg);
}

.go .body {
  transform: translateX(-50%) rotate(5deg);
}

.go .mouth {
  height: 28rpx;
  border-radius: 0 0 28rpx 28rpx;
}

.happy {
  animation: kafang-jump 0.72s ease-in-out infinite;
}

.happy .body {
  transform: translateX(-50%) rotate(8deg);
}

.happy .brow-left {
  transform: rotate(12deg);
}

.happy .brow-right {
  transform: rotate(-12deg);
}

.happy .mouth {
  left: 44rpx;
  top: 70rpx;
  width: 52rpx;
  height: 30rpx;
  border-radius: 0 0 42rpx 42rpx;
}

.happy .eye {
  background: #fff7ed;
}

.happy .pupil {
  width: 16rpx;
  height: 16rpx;
  margin-top: 10rpx;
  background: #f59e0b;
  clip-path: polygon(50% 0, 63% 34%, 100% 36%, 70% 57%, 82% 94%, 50% 72%, 18% 94%, 30% 57%, 0 36%, 37% 34%);
}

.nervous {
  animation: kafang-shake 0.38s ease-in-out infinite;
}

.nervous .body {
  transform: translateX(-50%) rotate(-8deg);
}

.nervous .mouth {
  left: 52rpx;
  top: 80rpx;
  width: 34rpx;
  height: 10rpx;
  border-top: 5rpx solid #07111f;
  border-bottom: 0;
  border-radius: 999rpx;
}

.nervous .brow-left {
  transform: rotate(22deg);
}

.nervous .brow-right {
  transform: rotate(-22deg);
}

.nervous .eye-left {
  transform: scaleY(0.82);
}

.nervous .cheek-right::after {
  content: "";
  position: absolute;
  right: -18rpx;
  top: -32rpx;
  width: 10rpx;
  height: 18rpx;
  border-radius: 999rpx;
  background: #38bdf8;
  transform: rotate(18deg);
}

.speaking .mouth {
  left: 49rpx;
  top: 69rpx;
  width: 42rpx;
  height: 34rpx;
  border: 5rpx solid #07111f;
  border-radius: 50%;
  background: #ef4444;
  animation: mouth-talk 0.34s ease-in-out infinite;
}

.tiny .axis {
  width: 14rpx;
  height: 11rpx;
  border-width: 1rpx;
  border-radius: 4rpx;
}

.tiny .axis-dot,
.tiny .face,
.tiny .cheek,
.tiny .name {
  display: none;
}

.tiny .body {
  top: 8rpx;
  width: 44rpx;
  height: 44rpx;
  padding: 3rpx;
  gap: 2rpx;
  border-width: 2rpx;
  border-radius: 8rpx;
}

.tiny .cell {
  border-radius: 3rpx;
}

.tiny .hand {
  top: 25rpx;
  width: 10rpx;
  height: 9rpx;
  border-width: 1rpx;
  border-radius: 4rpx;
}

.tiny .foot {
  bottom: 1rpx;
  width: 11rpx;
  height: 8rpx;
  border-width: 1rpx;
  border-radius: 4rpx;
}

.tiny .foot-left {
  left: 16rpx;
}

.tiny .foot-right {
  right: 14rpx;
}

@keyframes kafang-bob {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  45% {
    transform: translateY(-8rpx) rotate(2deg);
  }
  68% {
    transform: translateY(1rpx) rotate(-1deg);
  }
}

@keyframes kafang-jump {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg) scale(1);
  }
  36% {
    transform: translateY(-22rpx) rotate(5deg) scale(1.04);
  }
  58% {
    transform: translateY(2rpx) rotate(-4deg) scale(0.98);
  }
}

@keyframes kafang-shake {
  0%,
  100% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-3rpx) rotate(-2deg);
  }
  75% {
    transform: translateX(3rpx) rotate(2deg);
  }
}

@keyframes eye-blink {
  0%,
  88%,
  94%,
  100% {
    transform: scaleY(1);
  }
  90%,
  92% {
    transform: scaleY(0.12);
  }
}

@keyframes pupil-dart {
  0%,
  46%,
  100% {
    transform: translateX(0);
  }
  18% {
    transform: translateX(-4rpx);
  }
  66% {
    transform: translateX(4rpx);
  }
}

@keyframes mouth-talk {
  0%,
  100% {
    transform: rotate(-3deg) scaleY(0.62);
  }
  50% {
    transform: rotate(2deg) scaleY(1);
  }
}

@keyframes face-look {
  0%,
  100% {
    transform: translateX(0);
  }
  42% {
    transform: translateX(-2rpx);
  }
  72% {
    transform: translateX(2rpx);
  }
}
</style>
