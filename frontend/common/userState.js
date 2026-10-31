import { shopProducts, user as mockUser } from './mock.js'

const STORAGE_KEY = 'cube-arena-user-state'
const REWARD_KEY = 'cube-arena-battle-rewards'
const PRACTICE_REWARD_KEY = 'cube-arena-practice-rewards'

export const dailyLearningReward = {
  points: 10,
  coins: 80,
  weeklyBonusCoins: 160
}

export const practiceCompletionReward = {
  points: 8,
  coins: 24,
  firstDailyCoins: 56
}

export const battleOutcomeRule = {
  win: { points: 32, coins: 120 },
  lose: { points: -18, coins: 0 },
  abandon: { points: -24, coins: 0 }
}

export const streakGuardRule = {
  itemId: 'it-streak-freeze',
  penaltyPoints: 80
}

export const avatarOptions = [
  { id: 'cube-blue', label: '蓝方', icon: '方', colors: ['#22d3ee', '#2563eb'] },
  { id: 'cube-fire', label: '赤焰', icon: '焰', colors: ['#f97316', '#ef4444'] },
  { id: 'cube-star', label: '星轨', icon: '星', colors: ['#a855f7', '#22d3ee'] },
  { id: 'cube-green', label: '青藤', icon: '速', colors: ['#22c55e', '#14b8a6'] }
]

export const defaultUserState = {
  ...mockUser,
  avatarImage: '',
  avatarOption: 'cube-blue',
  equippedFrame: 'sp1',
  ownedFrames: ['sp1'],
  ownedProducts: ['sp1'],
  itemCounts: {},
  lastLearningRewardDate: '',
  lastLessonCompletedDate: '',
  lastLearningUnitId: '',
  currentTutorialId: 't1',
  lastStreakGuardMessageDate: '',
  lastStreakPenaltyDate: '',
  practiceSessions: {}
}

function formatDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function yesterdayKey() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return formatDate(date)
}

function daysBetween(fromKey, toKey) {
  const from = new Date(`${fromKey}T00:00:00`)
  const to = new Date(`${toKey}T00:00:00`)
  return Math.floor((to.getTime() - from.getTime()) / 86400000)
}

function readState() {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY)
    if (saved) return { ...defaultUserState, ...JSON.parse(saved) }
  } catch (error) {}
  return { ...defaultUserState }
}

function writeState(state) {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(state))
    if (uni.$emit) uni.$emit('user:changed', state)
  } catch (error) {}
  return state
}

export function getUserState() {
  return readState()
}

export function getDailyLearningRewardState() {
  const state = readState()
  const today = formatDate()
  return {
    state,
    streak: state.streak || 0,
    claimedToday: state.lastLearningRewardDate === today,
    points: dailyLearningReward.points,
    coins: dailyLearningReward.coins,
    weeklyBonusCoins: dailyLearningReward.weeklyBonusCoins
  }
}

export function updateUserState(patch) {
  return writeState({ ...readState(), ...patch })
}

function getTodaySessions(state = readState()) {
  const today = formatDate()
  const sessions = state.practiceSessions && state.practiceSessions[today]
    ? state.practiceSessions[today]
    : []
  return { today, sessions }
}

function compactPracticeSessions(sessionsByDate, today) {
  return Object.keys(sessionsByDate)
    .sort()
    .slice(-14)
    .reduce((result, key) => {
      result[key] = key === today ? sessionsByDate[key].slice(-24) : sessionsByDate[key].slice(-12)
      return result
    }, {})
}

export function getTodayPracticeState() {
  const state = readState()
  const { today, sessions } = getTodaySessions(state)
  const lessonDone = state.lastLessonCompletedDate === today ? 1 : 0
  const practiceDone = Math.min(sessions.length, 5)
  const totalSteps = 6
  const completedSteps = lessonDone + practiceDone

  return {
    state,
    date: today,
    streak: state.streak || 0,
    sessions,
    trainingBlocks: sessions.slice(-12).map((session, index) => ({
      ...session,
      tone: ['cyan', 'green', 'amber', 'violet', 'red'][index % 5]
    })),
    lessonDone,
    practiceDone,
    practiceTarget: 5,
    totalSteps,
    completedSteps,
    percent: Math.round((completedSteps / totalSteps) * 100),
    completed: completedSteps >= totalSteps
  }
}

export function recordPracticeCompletion(payload = {}) {
  const state = readState()
  const today = formatDate()
  const rewardId = payload.id || `practice-${today}-${Date.now()}`

  try {
    const rewarded = uni.getStorageSync(PRACTICE_REWARD_KEY) || {}
    if (rewarded[rewardId]) {
      return { recorded: false, state, points: 0, coins: 0, streak: state.streak || 0 }
    }

    const previousSessions = state.practiceSessions || {}
    const todaySessions = previousSessions[today] || []
    const firstDailyProgress = state.lastLearningRewardDate !== today
    const nextStreak = firstDailyProgress
      ? (state.lastLearningRewardDate === yesterdayKey()
        ? (state.streak || 0) + 1
        : (state.lastLearningRewardDate ? 1 : (state.streak || 0) + 1))
      : (state.streak || 0)
    const weeklyBonus = firstDailyProgress && nextStreak % 7 === 0 ? dailyLearningReward.weeklyBonusCoins : 0
    const points = practiceCompletionReward.points
    const coins = practiceCompletionReward.coins + (firstDailyProgress ? practiceCompletionReward.firstDailyCoins : 0) + weeklyBonus
    const session = {
      id: rewardId,
      cube: payload.cube || '3x3',
      time: payload.time || '',
      elapsed: payload.elapsed || 0,
      createdAt: Date.now()
    }
    const practiceSessions = compactPracticeSessions({
      ...previousSessions,
      [today]: todaySessions.concat(session)
    }, today)
    const next = writeState({
      ...state,
      points: (state.points || 0) + points,
      coins: (state.coins || 0) + coins,
      streak: nextStreak,
      lastLearningRewardDate: firstDailyProgress ? today : state.lastLearningRewardDate,
      lastLearningUnitId: firstDailyProgress ? rewardId : state.lastLearningUnitId,
      practiceSessions
    })

    rewarded[rewardId] = true
    uni.setStorageSync(PRACTICE_REWARD_KEY, rewarded)
    return {
      recorded: true,
      state: next,
      session,
      points,
      coins,
      streak: nextStreak,
      streakAdvanced: firstDailyProgress,
      weeklyBonus
    }
  } catch (error) {
    return { recorded: false, state, points: 0, coins: 0, streak: state.streak || 0 }
  }
}

export function getAvatarOption(id) {
  return avatarOptions.find(item => item.id === id) || avatarOptions[0]
}

export function getFrameProducts() {
  return shopProducts.filter(item => item.category === '头像框')
}

export function getEquippedFrame(user = readState()) {
  return getFrameProducts().find(item => item.id === user.equippedFrame) || getFrameProducts()[0]
}

export function buyProduct(product) {
  const state = readState()
  const currency = product.currency || 'coins'
  const balance = state[currency] || 0
  if (!product.consumable && state.ownedProducts.includes(product.id)) return { ok: true, state, owned: true }
  if (balance < product.price) return { ok: false, state, reason: currency }
  const ownedProducts = product.consumable ? state.ownedProducts : state.ownedProducts.concat(product.id)
  const ownedFrames = product.category === '头像框' && !state.ownedFrames.includes(product.id)
    ? state.ownedFrames.concat(product.id)
    : state.ownedFrames
  const itemCounts = product.consumable
    ? { ...state.itemCounts, [product.id]: (state.itemCounts[product.id] || 0) + 1 }
    : state.itemCounts
  const next = writeState({
    ...state,
    [currency]: balance - product.price,
    ownedProducts,
    ownedFrames,
    itemCounts,
    equippedFrame: product.category === '头像框' ? product.id : state.equippedFrame
  })
  return { ok: true, state: next, owned: false }
}

export function equipFrame(frameId) {
  const state = readState()
  if (!state.ownedFrames.includes(frameId)) return state
  return writeState({ ...state, equippedFrame: frameId })
}

export function applyBattleReward(rewardId, result) {
  const rule = battleOutcomeRule[result]
  if (!rule) return { rewarded: false, state: readState(), points: 0, coins: 0, result }
  const id = rewardId || `reward-${Date.now()}`
  try {
    const rewarded = uni.getStorageSync(REWARD_KEY) || {}
    if (rewarded[id]) return { rewarded: false, state: readState(), points: 0, coins: 0, result }
    const state = readState()
    const points = rule.points
    const coins = rule.coins
    const next = writeState({
      ...state,
      points: Math.max(0, (state.points || 0) + points),
      coins: Math.max(0, (state.coins || 0) + coins)
    })
    rewarded[id] = true
    uni.setStorageSync(REWARD_KEY, rewarded)
    return { rewarded: true, state: next, points, coins, result }
  } catch (error) {
    const state = readState()
    return { rewarded: false, state, points: 0, coins: 0, result }
  }
}

export function applyDailyLearningReward(unitId) {
  const state = readState()
  const today = formatDate()
  if (state.lastLearningRewardDate === today) {
    const next = state.lastLessonCompletedDate === today
      ? state
      : writeState({ ...state, lastLessonCompletedDate: today, lastLearningUnitId: unitId || state.lastLearningUnitId })
    return { rewarded: false, state: next, points: 0, coins: 0, streak: next.streak || 0, claimedToday: true }
  }

  const nextStreak = state.lastLearningRewardDate === yesterdayKey()
    ? (state.streak || 0) + 1
    : (state.lastLearningRewardDate ? 1 : (state.streak || 0) + 1)
  const bonusCoins = nextStreak % 7 === 0 ? dailyLearningReward.weeklyBonusCoins : 0
  const points = dailyLearningReward.points
  const coins = dailyLearningReward.coins + bonusCoins
  const next = writeState({
    ...state,
    streak: nextStreak,
    points: state.points + points,
    coins: state.coins + coins,
    lastLearningRewardDate: today,
    lastLessonCompletedDate: today,
    lastLearningUnitId: unitId || ''
  })

  return { rewarded: true, state: next, points, coins, streak: nextStreak, bonusCoins, claimedToday: true }
}

export function resolveLearningStreakGuard() {
  const state = readState()
  const today = formatDate()
  const lastDate = state.lastLearningRewardDate
  const currentStreak = state.streak || 0

  if (!lastDate || currentStreak <= 0) return { action: 'none', state }
  const missedDays = daysBetween(lastDate, today) - 1
  if (missedDays <= 0) return { action: 'none', state }
  if (state.lastStreakGuardMessageDate === today || state.lastStreakPenaltyDate === today) {
    return { action: 'none', state }
  }

  const freezeCount = state.itemCounts[streakGuardRule.itemId] || 0
  if (freezeCount >= missedDays) {
    const next = writeState({
      ...state,
      itemCounts: {
        ...state.itemCounts,
        [streakGuardRule.itemId]: freezeCount - missedDays
      },
      lastLearningRewardDate: yesterdayKey(),
      lastStreakGuardMessageDate: today
    })
    return {
      action: 'protected',
      state: next,
      message: `连胜方冻已自动消耗 ${missedDays} 个，帮你保护了 ${currentStreak} 天连胜。今天完成 1 个小单元，连胜还能继续涨。`
    }
  }

  const penalty = Math.min(state.points || 0, streakGuardRule.penaltyPoints)
  const next = writeState({
    ...state,
    streak: 0,
    points: Math.max(0, (state.points || 0) - penalty),
    lastStreakPenaltyDate: today
  })
  return {
    action: 'reset',
    state: next,
    penalty,
    message: `你有 ${missedDays} 天没有完成小单元，连胜已清空，并扣除 ${penalty} 积分。今天完成 1 个小单元可以重新开始连胜。`
  }
}
