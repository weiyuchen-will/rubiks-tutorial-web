<template>
  <view class="assistant-card glass-card" :class="tone">
    <view class="assistant-mascot">
      <KafangMascot :size="size" :mood="activeMood" :speaking="speaking" :show-name="showName" />
    </view>
    <view class="assistant-copy">
      <text class="assistant-name">咔方助手</text>
      <text class="assistant-message">{{ currentMessage }}</text>
    </view>
    <view class="voice-btn pressable" :class="{ speaking }" @tap.stop="playVoice">
      <text>{{ speaking ? '咔' : '▶' }}</text>
    </view>
  </view>
</template>

<script>
import KafangMascot from '@/components/KafangMascot/KafangMascot.vue'
import { getKafangLine, speakKafang } from '@/common/kafangVoice.js'

export default {
  name: 'KafangAssistant',
  components: { KafangMascot },
  props: {
    message: {
      type: String,
      default: '我盯着路线呢，下一步别乱转。'
    },
    mood: {
      type: String,
      default: 'cocky'
    },
    tone: {
      type: String,
      default: 'cyan'
    },
    size: {
      type: String,
      default: 'tiny'
    },
    showName: {
      type: Boolean,
      default: false
    },
    voicePack: {
      type: String,
      default: 'guide'
    }
  },
  data() {
    return {
      voiceIndex: 0,
      currentLine: '',
      speaking: false,
      voiceTimer: null
    }
  },
  computed: {
    currentMessage() {
      return this.currentLine || this.message
    },
    activeMood() {
      return this.speaking ? 'go' : this.mood
    }
  },
  beforeDestroy() {
    this.clearVoiceTimer()
  },
  unmounted() {
    this.clearVoiceTimer()
  },
  methods: {
    playVoice() {
      const line = getKafangLine(this.voicePack, this.voiceIndex)
      this.voiceIndex += 1
      this.currentLine = line
      this.speaking = true
      const spoken = speakKafang(line)
      if (!spoken) uni.showToast({ title: line, icon: 'none' })
      this.clearVoiceTimer()
      this.voiceTimer = setTimeout(() => {
        this.speaking = false
      }, Math.min(4200, Math.max(1500, line.length * 130)))
    },
    clearVoiceTimer() {
      if (this.voiceTimer) {
        clearTimeout(this.voiceTimer)
        this.voiceTimer = null
      }
    }
  }
}
</script>

<style scoped>
.assistant-card {
  margin-top: 18rpx;
  min-height: 104rpx;
  padding: 14rpx 18rpx 14rpx 12rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
  overflow: hidden;
}

.assistant-card.cyan {
  border-color: rgba(34, 211, 238, 0.26);
}

.assistant-card.green {
  border-color: rgba(34, 197, 94, 0.28);
}

.assistant-card.orange {
  border-color: rgba(249, 115, 22, 0.3);
}

.assistant-card.purple {
  border-color: rgba(168, 85, 247, 0.3);
}

.assistant-mascot {
  width: 62rpx;
  height: 70rpx;
  flex: 0 0 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-copy {
  min-width: 0;
  flex: 1;
}

.assistant-name {
  display: block;
  color: #22d3ee;
  font-size: 24.2rpx;
  font-weight: 900;
}

.assistant-message {
  margin-top: 6rpx;
  display: block;
  color: var(--app-title);
  font-size: 26.4rpx;
  line-height: 37.4rpx;
  font-weight: 800;
  word-break: break-word;
}

.voice-btn {
  width: 54rpx;
  height: 54rpx;
  flex: 0 0 54rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #08111f;
  font-size: 22rpx;
  font-weight: 900;
  background: #22d3ee;
  box-shadow: 0 10rpx 22rpx rgba(34, 211, 238, 0.18);
}

.voice-btn.speaking {
  background: #facc15;
  animation: voice-pulse 0.58s ease-in-out infinite;
}

@keyframes voice-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
