<script>
import { initBackgroundMusic } from './common/music.js'
import { initTheme } from './common/theme.js'
import { resolveLearningStreakGuard } from './common/userState.js'

export default {
  onLaunch() {
    console.log('Cube Arena Launch')
    initTheme()
    initBackgroundMusic()
    this.checkLearningStreak()
  },
  onShow() {
    initTheme()
    initBackgroundMusic()
    this.checkLearningStreak()
  },
  methods: {
    checkLearningStreak() {
      const result = resolveLearningStreakGuard()
      if (!result.message) return
      setTimeout(() => {
        uni.showModal({
          title: '连胜提醒',
          content: result.message,
          confirmText: '去打卡',
          cancelText: '稍后',
          success: response => {
            if (!response.confirm) return
            uni.navigateTo({
              url: '/pages/tutorial-detail/tutorial-detail?id=t1',
              fail: () => uni.redirectTo({ url: '/pages/tutorials/tutorials' })
            })
          }
        })
      }, 500)
    }
  }
}
</script>

<style>
html {
  --app-page-bg: linear-gradient(180deg, #020617 0%, #0f172a 100%);
  --app-shell-bg:
    radial-gradient(circle at 18% 0%, rgba(34, 211, 238, 0.14), transparent 36%),
    radial-gradient(circle at 88% 14%, rgba(168, 85, 247, 0.12), transparent 32%),
    linear-gradient(180deg, #020617 0%, #0f172a 100%);
  --app-text-primary: #e2e8f0;
  --app-text-secondary: #94a3b8;
  --app-surface: rgba(255, 255, 255, 0.06);
  --app-surface-strong: rgba(255, 255, 255, 0.08);
  --app-border: rgba(255, 255, 255, 0.1);
  --app-icon-bg: rgba(255, 255, 255, 0.07);
  --app-chip-bg: rgba(255, 255, 255, 0.07);
  --app-chip-text: #cbd5e1;
  --app-title: #f8fafc;
  --app-link: #22d3ee;
  --app-muted-panel: rgba(255, 255, 255, 0.055);
  --app-soft-fill: rgba(255, 255, 255, 0.12);
  --app-card-shadow: 0 16rpx 42rpx rgba(2, 6, 23, 0.28);
  --app-tabbar-bg: #0f172a;
  --app-tabbar-border: rgba(255, 255, 255, 0.08);
  --app-tabbar-text: #94a3b8;
  --app-tabbar-active: #22d3ee;
}

html[data-theme="light"],
body[data-theme="light"] {
  --app-page-bg: linear-gradient(180deg, #f8fbff 0%, #edf4ff 100%);
  --app-shell-bg:
    radial-gradient(circle at 18% 0%, rgba(34, 211, 238, 0.18), transparent 36%),
    radial-gradient(circle at 88% 14%, rgba(59, 130, 246, 0.1), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  --app-text-primary: #0f172a;
  --app-text-secondary: #475569;
  --app-surface: rgba(255, 255, 255, 0.88);
  --app-surface-strong: rgba(255, 255, 255, 0.96);
  --app-border: rgba(15, 23, 42, 0.08);
  --app-icon-bg: rgba(15, 23, 42, 0.04);
  --app-chip-bg: rgba(15, 23, 42, 0.05);
  --app-chip-text: #334155;
  --app-title: #0f172a;
  --app-link: #0284c7;
  --app-muted-panel: rgba(15, 23, 42, 0.04);
  --app-soft-fill: rgba(14, 165, 233, 0.14);
  --app-card-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.08);
  --app-tabbar-bg: rgba(255, 255, 255, 0.9);
  --app-tabbar-border: rgba(15, 23, 42, 0.08);
  --app-tabbar-text: #64748b;
  --app-tabbar-active: #0ea5e9;
}

page {
  min-height: 100%;
  color: var(--app-text-primary);
  background: var(--app-page-bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

view,
text,
scroll-view,
swiper,
swiper-item,
input,
button,
image {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;
}

button::after {
  border: 0;
}

.page-shell {
  min-height: 100vh;
  padding: 0 24rpx 44rpx;
  background: var(--app-shell-bg);
}

.page-with-tab {
  padding-bottom: calc(148rpx + env(safe-area-inset-bottom));
}

.top-bar {
  height: 112rpx;
  padding-top: 34rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-title {
  min-width: 0;
  color: var(--app-title);
  font-size: 41.8rpx;
  font-weight: 800;
  letter-spacing: 0;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon-btn {
  width: 68rpx;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
  background: var(--app-icon-bg);
  border: 1rpx solid var(--app-border);
}

.icon-btn:active,
.pressable:active,
.card-press:active {
  opacity: 0.82;
  transform: scale(0.97);
}

.glass-card {
  border-radius: 8rpx;
  background: var(--app-surface);
  border: 1rpx solid var(--app-border);
  box-shadow: var(--app-card-shadow);
}

.section-head {
  margin: 34rpx 0 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  color: var(--app-title);
  font-size: 33rpx;
  font-weight: 800;
}

.section-link {
  color: var(--app-link);
  font-size: 26.4rpx;
}

.muted {
  color: var(--app-text-secondary);
}

.chip {
  min-height: 48rpx;
  padding: 0 22rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-chip-text);
  font-size: 26.4rpx;
  background: var(--app-chip-bg);
  border: 1rpx solid var(--app-border);
  white-space: nowrap;
}

.chip.active {
  color: #08111f;
  background: #22d3ee;
  border-color: rgba(34, 211, 238, 0.7);
}

.mono {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.cube-mosaic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
}

.cube-cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4rpx;
}
</style>
