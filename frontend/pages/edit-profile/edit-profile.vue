<template>
  <view class="page-shell simple-page">
    <view class="top-bar">
      <view class="icon-btn pressable" @tap="back">‹</view>
      <text class="top-title">{{ $t('titleEditProfile') }}</text>
      <view class="icon-btn pressable" @tap="save">✓</view>
    </view>

    <view class="profile-editor glass-card">
      <view class="avatar-preview" :style="{ background: frameGradient }">
        <image v-if="form.avatarImage" class="avatar-image" :src="form.avatarImage" mode="aspectFill" />
        <view v-else class="avatar-face" :style="{ background: avatarGradient }">
          <text>{{ selectedAvatar.icon }}</text>
        </view>
      </view>
      <text class="frame-name">{{ frameName }}</text>
      <input class="name-input" v-model="form.name" maxlength="16" placeholder="输入昵称" placeholder-class="placeholder" />
      <view class="avatar-actions">
        <view class="mini-btn pressable" @tap="chooseImage">更换图片</view>
        <view class="mini-btn ghost pressable" @tap="clearImage">使用魔方头像</view>
      </view>
      <view class="save-btn pressable" @tap="save">保存资料</view>
    </view>

    <KafangAssistant message="名字和头像就是你的竞技名片，咔方建议要够醒目。" mood="happy" tone="cyan" voice-pack="profile" />

    <view class="section-head">
      <text class="section-title">选择头像</text>
      <text class="muted">本地 mock</text>
    </view>
    <view class="avatar-grid">
      <view
        v-for="item in avatarOptions"
        :key="item.id"
        class="avatar-choice glass-card pressable"
        :class="{ active: form.avatarOption === item.id }"
        @tap="form.avatarOption = item.id"
      >
        <view class="choice-face" :style="{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }">
          <text>{{ item.icon }}</text>
        </view>
        <text class="choice-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">已拥有头像框</text>
      <text class="muted">{{ ownedFrames.length }} 个</text>
    </view>
    <view class="frame-list">
      <view
        v-for="frame in ownedFrames"
        :key="frame.id"
        class="frame-row glass-card card-press"
        :class="{ active: form.equippedFrame === frame.id }"
        @tap="form.equippedFrame = frame.id"
      >
        <view class="frame-swatch" :style="{ background: `conic-gradient(${frame.color}, #fff, ${frame.color})` }" />
        <view class="frame-copy">
          <text class="frame-title">{{ frame.name }}</text>
          <text class="frame-desc">{{ frame.desc }}</text>
        </view>
        <text class="frame-state">{{ form.equippedFrame === frame.id ? '使用中' : '装备' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import KafangAssistant from '@/components/KafangAssistant/KafangAssistant.vue'
import { avatarOptions, getAvatarOption, getEquippedFrame, getFrameProducts, getUserState, updateUserState } from '@/common/userState.js'

export default {
  components: { KafangAssistant },
  data() {
    const user = getUserState()
    return {
      avatarOptions,
      form: {
        name: user.name,
        avatarImage: user.avatarImage,
        avatarOption: user.avatarOption,
        equippedFrame: user.equippedFrame
      },
      user
    }
  },
  computed: {
    selectedAvatar() {
      return getAvatarOption(this.form.avatarOption)
    },
    avatarGradient() {
      return `linear-gradient(135deg, ${this.selectedAvatar.colors[0]}, ${this.selectedAvatar.colors[1]})`
    },
    ownedFrames() {
      const products = getFrameProducts()
      return products.filter(item => this.user.ownedFrames.includes(item.id))
    },
    frameName() {
      const frame = this.ownedFrames.find(item => item.id === this.form.equippedFrame) || getEquippedFrame(this.user)
      return frame ? frame.name : '默认头像框'
    },
    frameGradient() {
      const frame = this.ownedFrames.find(item => item.id === this.form.equippedFrame) || getEquippedFrame(this.user)
      return `conic-gradient(${frame.color}, #fff, ${frame.color}, #f97316, ${frame.color})`
    }
  },
  onShow() {
    this.user = getUserState()
    this.form.name = this.user.name
    this.form.avatarImage = this.user.avatarImage
    this.form.avatarOption = this.user.avatarOption
    this.form.equippedFrame = this.user.equippedFrame
  },
  methods: {
    back() {
      uni.redirectTo({ url: '/pages/profile/profile' })
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        uni.showToast({ title: '昵称不能为空', icon: 'none' })
        return
      }
      updateUserState({
        name,
        avatarImage: this.form.avatarImage,
        avatarOption: this.form.avatarOption,
        equippedFrame: this.form.equippedFrame
      })
      uni.showToast({ title: '资料已保存', icon: 'none' })
      setTimeout(() => this.back(), 350)
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const path = res.tempFilePaths && res.tempFilePaths[0]
          if (path) this.form.avatarImage = path
        }
      })
    },
    clearImage() {
      this.form.avatarImage = ''
    }
  }
}
</script>

<style scoped>
.simple-page {
  padding-bottom: 54rpx;
}

.profile-editor {
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 150rpx;
  height: 150rpx;
  padding: 8rpx;
  border-radius: 50%;
}

.avatar-face {
  width: 134rpx;
  height: 134rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 50.6rpx;
  font-weight: 900;
  box-shadow: inset 0 -12rpx 22rpx rgba(2, 6, 23, 0.22);
}

.avatar-image {
  width: 134rpx;
  height: 134rpx;
  border-radius: 50%;
}

.frame-name {
  margin-top: 14rpx;
  color: #22d3ee;
  font-size: 26.4rpx;
  font-weight: 900;
}

.name-input {
  width: 100%;
  height: 82rpx;
  margin-top: 24rpx;
  padding: 0 20rpx;
  border-radius: 8rpx;
  color: var(--app-title);
  font-size: 30.8rpx;
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.avatar-actions {
  width: 100%;
  margin-top: 16rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.mini-btn {
  height: 62rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 26.4rpx;
  font-weight: 900;
  background: #22d3ee;
}

.mini-btn.ghost {
  color: var(--app-title);
  background: var(--app-muted-panel);
  border: 1rpx solid var(--app-border);
}

.placeholder {
  color: var(--app-text-secondary);
}

.save-btn {
  width: 100%;
  height: 78rpx;
  margin-top: 18rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-size: 29.7rpx;
  font-weight: 900;
  background: #22d3ee;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.avatar-choice {
  min-width: 0;
  padding: 14rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.avatar-choice.active,
.frame-row.active {
  border-color: #22d3ee;
  box-shadow: 0 0 0 3rpx rgba(34, 211, 238, 0.14);
}

.choice-face {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26.4rpx;
  font-weight: 900;
}

.choice-label {
  max-width: 100%;
  overflow: hidden;
  color: var(--app-title);
  font-size: 23.1rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.frame-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.frame-row {
  padding: 18rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.frame-swatch {
  width: 62rpx;
  height: 62rpx;
  border-radius: 50%;
  flex: 0 0 62rpx;
}

.frame-copy {
  min-width: 0;
  flex: 1;
}

.frame-title {
  color: var(--app-title);
  font-size: 28.6rpx;
  font-weight: 900;
}

.frame-desc {
  margin-top: 6rpx;
  display: block;
  color: var(--app-text-secondary);
  font-size: 24.2rpx;
  line-height: 33rpx;
}

.frame-state {
  color: #22d3ee;
  font-size: 25.3rpx;
  font-weight: 900;
}
</style>
