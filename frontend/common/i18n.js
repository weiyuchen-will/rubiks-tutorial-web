const STORAGE_KEY = 'cube-arena-language'

export const languageOptions = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' }
]

export const messages = {
  zh: {
    appName: '魔方竞技场',
    commonBack: '返回',
    commonMockDesc: '这里是魔方竞技场的本地 mock 页面，可继续扩展真实内容与交互。',
    comingSoon: '即将开放',
    tabHome: '首页',
    tabTutorials: '教程',
    tabPractice: '练习',
    tabBattle: 'PK',
    tabShop: '商城',
    tabProfile: '我的',
    titleHome: '魔方竞技场',
    titleTutorials: '教程视频库',
    titlePractice: '练习计时',
    titleBattle: 'PK 对战',
    titleProfile: '我的',
    titleShop: '金币商城',
    titleSettings: '账号设置',
    titleTheme: '主题设置',
    themeTitle: '界面主题',
    themeDesc: '切换浅色或深色背景',
    titleAbout: '关于 App',
    titleRankings: '排行榜',
    titleFavorites: '我的收藏',
    titleRecent: '最近观看',
    titleMistakes: '错题本',
    titleRecords: '成绩记录',
    titleEditProfile: '编辑资料',
    titleLanguage: '语言设置',
    musicTitle: '背景音乐',
    musicDesc: '开启后将循环播放炫酷电子音乐',
    musicTrack: '音乐曲目',
    musicArtist: '作者',
    musicVolume: '音量',
    musicEnabled: '开启',
    musicDisabled: '关闭',
    themeSaved: '主题已切换',
    rankingScore: '积分榜',
    rankingSpeed: '速度榜',
    rankingWinRate: '胜率榜',
    rankingPractice: '练习榜',
    rankingStreak: '连胜榜',
    rankingTop3: '前三名',
    rankingMyRank: '我的排名',
    rankingCurrentUser: '当前用户',
    rankingRank: '排名',
    rankingLevel: '等级',
    rankingValue: '成绩',
    rankingPoints: '积分',
    rankingSeconds: '秒',
    rankingPercent: '%',
    rankingCount: '次',
    rankingBehindScore: '距离上一名还差 {value} 积分',
    rankingBehindSpeed: '距离上一名还差 {value} 秒',
    rankingBehindWinRate: '距离上一名还差 {value}%',
    rankingBehindPractice: '距离上一名还差 {value} 次',
    rankingBehindStreak: '距离上一名还差 {value} 天',
    rankingLeadScore: '领先第二名 {value} 积分',
    rankingLeadSpeed: '领先第二名 {value} 秒',
    rankingLeadWinRate: '领先第二名 {value}%',
    rankingLeadPractice: '领先第二名 {value} 次',
    rankingLeadStreak: '领先第二名 {value} 天',
    profileData: '成长数据',
    profileProgress: '学习进度',
    profileEntries: '收藏与记录',
    profileBadges: '勋章',
    profileSettings: '设置',
    profileShop: '金币商城',
    profileFavorites: '我的收藏',
    profileRecent: '最近观看',
    profileMistakes: '错题本',
    profileRecords: '成绩记录',
    profileAccount: '账号设置',
    profileTheme: '主题设置',
    profileAbout: '关于 App',
    settingsLanguage: '语言',
    settingsLanguageDesc: '切换 App 界面显示语言',
    settingsCurrentLanguage: '当前语言',
    settingsSaved: '语言已切换',
    settingsAccount: '账号设置',
    shopHeroTitle: '魔方竞技补给站',
    shopHeroSub: '用练习和对战获得的金币与积分兑换头像框、课程包与训练道具。',
    shopProducts: '可兑换商品',
    shopAll: '全部',
    shopAvatarFrame: '头像框',
    shopCoursePack: '课程包',
    shopItem: '道具',
    shopCoins: '金币',
    shopBuy: '兑换',
    shopInsufficient: '不足',
    shopSuccess: '兑换成功',
    shopNotEnough: '金币不足',
    aboutDesc: '魔方竞技场是一款面向学习、练习和对战的移动端前端原型，当前使用本地 mock 数据。'
  },
  en: {
    appName: 'Cube Arena',
    commonBack: 'Back',
    commonMockDesc: 'This is a local mock page for Cube Arena. Real content and interactions can be added later.',
    comingSoon: 'Coming soon',
    tabHome: 'Home',
    tabTutorials: 'Lessons',
    tabPractice: 'Practice',
    tabBattle: 'Battle',
    tabShop: 'Shop',
    tabProfile: 'Me',
    titleHome: 'Cube Arena',
    titleTutorials: 'Video Library',
    titlePractice: 'Practice Timer',
    titleBattle: 'PK Battle',
    titleProfile: 'Me',
    titleShop: 'Coin Shop',
    titleSettings: 'Account Settings',
    titleTheme: 'Theme',
    themeTitle: 'Interface Theme',
    themeDesc: 'Switch between light and dark backgrounds',
    titleAbout: 'About',
    titleRankings: 'Rankings',
    titleFavorites: 'Favorites',
    titleRecent: 'Recently Watched',
    titleMistakes: 'Mistakes',
    titleRecords: 'Solve Records',
    titleEditProfile: 'Edit Profile',
    titleLanguage: 'Language',
    musicTitle: 'Background Music',
    musicDesc: 'Loop a cool electronic track in the background',
    musicTrack: 'Track',
    musicArtist: 'Artist',
    musicVolume: 'Volume',
    musicEnabled: 'On',
    musicDisabled: 'Off',
    themeSaved: 'Theme switched',
    rankingScore: 'Score',
    rankingSpeed: 'Speed',
    rankingWinRate: 'Win Rate',
    rankingPractice: 'Practice',
    rankingStreak: 'Streak',
    rankingTop3: 'Top 3',
    rankingMyRank: 'My Rank',
    rankingCurrentUser: 'You',
    rankingRank: 'Rank',
    rankingLevel: 'Level',
    rankingValue: 'Value',
    rankingPoints: 'points',
    rankingSeconds: 's',
    rankingPercent: '%',
    rankingCount: 'times',
    rankingBehindScore: '{value} points behind the leader',
    rankingBehindSpeed: '{value}s behind the leader',
    rankingBehindWinRate: '{value}% behind the leader',
    rankingBehindPractice: '{value} sessions behind the leader',
    rankingBehindStreak: '{value} days behind the leader',
    rankingLeadScore: '{value} points ahead of #2',
    rankingLeadSpeed: '{value}s ahead of #2',
    rankingLeadWinRate: '{value}% ahead of #2',
    rankingLeadPractice: '{value} sessions ahead of #2',
    rankingLeadStreak: '{value} days ahead of #2',
    profileData: 'Growth Stats',
    profileProgress: 'Learning Progress',
    profileEntries: 'Library & Records',
    profileBadges: 'Badges',
    profileSettings: 'Settings',
    profileShop: 'Coin Shop',
    profileFavorites: 'Favorites',
    profileRecent: 'Recently Watched',
    profileMistakes: 'Mistakes',
    profileRecords: 'Solve Records',
    profileAccount: 'Account Settings',
    profileTheme: 'Theme',
    profileAbout: 'About',
    settingsLanguage: 'Language',
    settingsLanguageDesc: 'Switch the interface language',
    settingsCurrentLanguage: 'Current language',
    settingsSaved: 'Language switched',
    settingsAccount: 'Account Settings',
    shopHeroTitle: 'Cube Arena Supply',
    shopHeroSub: 'Spend coins and points earned from practice and battles on frames, course packs, and training items.',
    shopProducts: 'Redeemable Items',
    shopAll: 'All',
    shopAvatarFrame: 'Frames',
    shopCoursePack: 'Courses',
    shopItem: 'Items',
    shopCoins: 'coins',
    shopBuy: 'Redeem',
    shopInsufficient: 'Low',
    shopSuccess: 'Redeemed',
    shopNotEnough: 'Not enough coins',
    aboutDesc: 'Cube Arena is a mobile front-end prototype for learning, practice, and battles, currently powered by local mock data.'
  }
}

let currentLanguage = 'zh'

try {
  const saved = uni.getStorageSync(STORAGE_KEY)
  if (saved && messages[saved]) currentLanguage = saved
} catch (error) {
  currentLanguage = 'zh'
}

export function getLanguage() {
  return currentLanguage
}

export function setLanguage(lang) {
  if (!messages[lang]) return currentLanguage
  currentLanguage = lang
  try {
    uni.setStorageSync(STORAGE_KEY, lang)
    if (uni.setLocale) uni.setLocale(lang === 'zh' ? 'zh-Hans' : 'en')
    uni.$emit('language:changed', lang)
  } catch (error) {
    // Storage can be unavailable in some preview contexts.
  }
  return currentLanguage
}

export function t(key, params = {}) {
  const template = messages[currentLanguage][key] || messages.zh[key] || key
  return Object.keys(params).reduce((text, name) => {
    return text.replace(new RegExp(`\\{${name}\\}`, 'g'), params[name])
  }, template)
}

export const i18nMixin = {
  data() {
    return {
      __languageTick: 0
    }
  },
  created() {
    this.__languageHandler = () => {
      this.__languageTick += 1
    }
    if (uni.$on) uni.$on('language:changed', this.__languageHandler)
  },
  beforeDestroy() {
    if (uni.$off && this.__languageHandler) uni.$off('language:changed', this.__languageHandler)
  },
  unmounted() {
    if (uni.$off && this.__languageHandler) uni.$off('language:changed', this.__languageHandler)
  },
  methods: {
    $t(key, params) {
      this.__languageTick
      return t(key, params)
    },
    $lang() {
      this.__languageTick
      return getLanguage()
    }
  }
}
