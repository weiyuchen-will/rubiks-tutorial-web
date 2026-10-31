export const tabItems = [
  { label: '首页', labelKey: 'tabHome', icon: '⌂', path: '/pages/home/home', key: 'home', color: '#38d5ff', bg: 'rgba(56, 213, 255, 0.14)' },
  { label: '教程', labelKey: 'tabTutorials', icon: '▣', path: '/pages/tutorials/tutorials', key: 'tutorials', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.14)' },
  { label: '练习', labelKey: 'tabPractice', icon: '●', path: '/pages/practice/practice', key: 'practice', color: '#f97316', bg: 'rgba(249, 115, 22, 0.14)' },
  { label: 'PK', labelKey: 'tabBattle', icon: '♥', path: '/pages/battle/battle', key: 'battle', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.16)' },
  { label: '商城', labelKey: 'tabShop', icon: '◆', path: '/pages/shop/shop', key: 'shop', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.16)' },
  { label: '我的', labelKey: 'tabProfile', icon: '⋯', path: '/pages/profile/profile', key: 'profile', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.16)' }
]

export const user = {
  id: 'me',
  name: '星轨 Cubist',
  level: 12,
  points: 2480,
  coins: 860,
  avatar: '/static/logo.png',
  winRate: '68%',
  best: '00:24.82',
  streak: 9
}

export const banners = [
  { id: 1, title: '3x3 新手入门路线', sub: '从白十字到完整复原，建立稳定手法', accent: '#22d3ee' },
  { id: 2, title: 'F2L 进阶训练', sub: '识别配对、减少停顿，冲击 45 秒', accent: '#a855f7' },
  { id: 3, title: 'AI 对战挑战赛', sub: '匹配不同速度机器人，练出比赛节奏', accent: '#f97316' }
]

export const tutorials = [
  {
    id: 't1',
    title: '3x3 白十字入门',
    intro: '认识棱块方向，完成底层白色十字。',
    cube: '3x3',
    difficulty: '入门',
    duration: '08:36',
    tagColor: '#22c55e',
    favorite: true,
    progress: 62
  },
  {
    id: 't2',
    title: '3x3 第一层角块',
    intro: '用基础手法归位底层四个角块。',
    cube: '3x3',
    difficulty: '入门',
    duration: '10:12',
    tagColor: '#22c55e',
    favorite: false,
    progress: 30
  },
  {
    id: 't3',
    title: 'F2L 基础配对',
    intro: '建立槽位观察，学习两组高频配对。',
    cube: '3x3',
    difficulty: '进阶',
    duration: '13:45',
    tagColor: '#f97316',
    favorite: false,
    progress: 18
  },
  {
    id: 't4',
    title: '4x4 中心块复原',
    intro: '掌握中心块构建顺序，避免颜色方向错误。',
    cube: '4x4',
    difficulty: '进阶',
    duration: '15:20',
    tagColor: '#a855f7',
    favorite: true,
    progress: 0
  },
  {
    id: 't5',
    title: 'PLL 识别训练',
    intro: '用图形特征快速判断 PLL 情况。',
    cube: '3x3',
    difficulty: '提速',
    duration: '18:08',
    tagColor: '#ef4444',
    favorite: false,
    progress: 0
  }
]

const beginnerLessonNodes = [
  { label: '白十字', icon: '★', tutorialId: 't1', state: 'active', tone: 'cyan' },
  { label: '第一层角块', icon: '1', tutorialId: 't2', state: 'ready', tone: 'yellow' },
  { label: '第二层棱块', icon: '2', tutorialId: 't3', state: 'locked', tone: 'green' },
  { label: '顶层十字', icon: '十', tutorialId: 't5', state: 'locked', tone: 'orange' },
  { label: '顶层朝向', icon: 'O', tutorialId: 't5', state: 'locked', tone: 'purple' },
  { label: '顶层换位', icon: 'P', tutorialId: 't5', state: 'locked', tone: 'pink' },
  { label: '复习宝箱', icon: '▣', path: '/pages/mistakes/mistakes', state: 'locked', tone: 'orange' },
  { label: '总复习考核', icon: '✓', path: '/pages/formula-trainer/formula-trainer', state: 'locked', tone: 'cyan' },
  { label: '更多教程', icon: '▶', path: '/pages/tutorials/tutorials', state: 'locked', tone: 'purple' }
]

export const tutorialLessonPlans = {
  t1: {
    heroName: '第 1 阶段',
    missionStage: '第 1 部分 · 白十字',
    missionTitle: '继续学习白十字',
    primaryTutorialId: 't1',
    nodes: beginnerLessonNodes,
    steps: [
      { title: '认识中心块和棱块', desc: '先确认色块结构，建立复原方向。' },
      { title: '找到白色棱块', desc: '把白色棱块移动到顶层或底层。' },
      { title: '完成白色十字', desc: '依次对齐四个侧面中心色。' },
      { title: '检查侧面颜色', desc: '白十字完成后确认每条棱块位置。' }
    ]
  },
  t2: {
    heroName: '第 1 阶段',
    missionStage: '第 2 部分 · 第一层角块',
    missionTitle: '继续学习第一层角块',
    primaryTutorialId: 't2',
    nodes: beginnerLessonNodes.map(item => item.tutorialId === 't2' ? { ...item, state: 'active' } : item.tutorialId === 't1' ? { ...item, state: 'ready' } : item),
    steps: [
      { title: '观察角块颜色', desc: '找到带白色的角块，判断它属于哪个底层角位。' },
      { title: '送到目标上方', desc: '用上层转动把角块移动到目标位置上面。' },
      { title: '用基础手法入位', desc: '重复右手或左手小鱼，让角块稳定落到底层。' },
      { title: '检查四个角位', desc: '确认白面完整，侧面颜色也对齐中心块。' }
    ]
  },
  t3: {
    heroName: 'CFOP 进阶',
    missionStage: '第 3 部分 · F2L 配对',
    missionTitle: '继续学习 F2L 基础配对',
    primaryTutorialId: 't3',
    nodes: beginnerLessonNodes.map(item => item.tutorialId === 't3' ? { ...item, state: 'active' } : item),
    steps: [
      { title: '识别角棱关系', desc: '先看角块和棱块是否同槽、同向或需要拆开。' },
      { title: '分离错误连接', desc: '角棱连错时先拆开，给配对留下观察空间。' },
      { title: '完成顶层配对', desc: '用上层调整让角棱在顶层形成可入槽结构。' },
      { title: '顺手插入槽位', desc: '选择左侧或右侧插入，减少多余转体。' }
    ]
  },
  t4: {
    heroName: '4x4 复原路线',
    missionStage: '第 1 部分 · 中心块',
    missionTitle: '继续学习 4x4 中心块复原',
    primaryTutorialId: 't4',
    nodes: [
      { label: '认识结构', icon: '4', tutorialId: 't4', state: 'active', tone: 'cyan' },
      { label: '六面中心块', icon: '中', tutorialId: 't4', state: 'ready', tone: 'yellow' },
      { label: '十二条棱块', icon: '棱', tutorialId: 't4', state: 'locked', tone: 'green' },
      { label: '降阶成 3x3', icon: '3', tutorialId: 't1', state: 'locked', tone: 'orange' },
      { label: '白十字复原', icon: '★', tutorialId: 't1', state: 'locked', tone: 'cyan' },
      { label: '顶层复原', icon: 'P', tutorialId: 't5', state: 'locked', tone: 'purple' },
      { label: '特殊情况', icon: '!', tutorialId: 't4', state: 'locked', tone: 'pink' },
      { label: '专项练习', icon: '✓', path: '/pages/special-practice/special-practice', state: 'locked', tone: 'cyan' },
      { label: '更多教程', icon: '▶', path: '/pages/tutorials/tutorials', state: 'locked', tone: 'purple' }
    ],
    steps: [
      { title: '确认 4x4 没有固定中心', desc: '先建立配色方向，避免中心块顺序复原错位。' },
      { title: '构建第一组中心块', desc: '从白色和黄色开始，把同色中心拼成 2x2 小面。' },
      { title: '补齐剩余四个中心', desc: '按相对色关系复原红、橙、蓝、绿中心面。' },
      { title: '配对十二条棱块', desc: '把同色棱块合成一条完整棱，为降阶做准备。' },
      { title: '按 3x3 方法完成还原', desc: '中心和棱块完成后，把 4x4 当作 3x3 继续复原。' }
    ]
  },
  t5: {
    heroName: '提速训练',
    missionStage: '第 5 部分 · PLL 识别',
    missionTitle: '继续学习 PLL 识别训练',
    primaryTutorialId: 't5',
    nodes: beginnerLessonNodes.map(item => item.tutorialId === 't5' ? { ...item, state: 'active' } : item),
    steps: [
      { title: '观察顶层侧面图形', desc: '先找相同色块和连续色带，减少盲猜。' },
      { title: '判断换位类型', desc: '区分三棱轮换、两组交换和角块换位情况。' },
      { title: '调用对应 PLL 公式', desc: '确认图形后再出手，保持手法节奏稳定。' },
      { title: '复盘识别速度', desc: '记录容易混淆的图形，放进公式训练反复刷。' }
    ]
  }
}

export const learningPaths = [
  { type: 'beginner', title: '3x3 新手路线', desc: '完整复原第一条路线', progress: 40 },
  { type: 'cfop', title: 'CFOP 进阶路线', desc: 'F2L、OLL、PLL 系统学习', progress: 26 },
  { type: 'speed', title: '提速训练路线', desc: '观察、手法、节奏专项', progress: 18 }
]

export const shopProducts = [
  {
    id: 'sp1',
    name: '青焰头像框',
    category: '头像框',
    price: 320,
    tag: '竞技',
    desc: '个人资料页展示青色能量边框。',
    color: '#22d3ee'
  },
  {
    id: 'sp2',
    name: '紫电头像框',
    category: '头像框',
    price: 520,
    tag: '稀有',
    desc: '对战房间显示紫色动效边框。',
    color: '#a855f7'
  },
  {
    id: 'sp7',
    name: '赤焰冠军框',
    category: '头像框',
    price: 780,
    tag: '冠军',
    desc: '胜利场景更醒目的红色冠军边框。',
    color: '#ef4444'
  },
  {
    id: 'sp8',
    name: '金色连胜框',
    category: '头像框',
    price: 960,
    tag: '传说',
    desc: '给连续胜利玩家准备的金色高光边框。',
    color: '#facc15'
  },
  {
    id: 'sp9',
    name: '青藤打卡框',
    category: '头像框',
    price: 420,
    tag: '成长',
    desc: '适合稳定练习玩家的绿色成长边框。',
    color: '#22c55e'
  },
  {
    id: 'sp10',
    name: '深空星轨框',
    category: '头像框',
    price: 880,
    tag: '星轨',
    desc: '深空蓝紫渐变风格的高阶玩家边框。',
    color: '#6366f1'
  },
  {
    id: 'sp3',
    name: 'PLL 识别课程包',
    category: '课程包',
    price: 680,
    tag: '提速',
    desc: '解锁 12 个 PLL 识别专项 mock 课程。',
    color: '#ef4444'
  },
  {
    id: 'sp4',
    name: 'F2L 观察训练包',
    category: '课程包',
    price: 560,
    tag: '进阶',
    desc: '强化配对观察与无转体入槽训练。',
    color: '#f97316'
  },
  {
    id: 'sp5',
    name: '双倍金币卡',
    category: '道具',
    price: 180,
    tag: '24h',
    desc: '练习与对战金币收益翻倍一天。',
    color: '#22c55e'
  },
  {
    id: 'sp6',
    name: '错题清理卡',
    category: '道具',
    price: 120,
    tag: '训练',
    desc: '从错题本中标记一组公式为已掌握。',
    color: '#38bdf8'
  },
  {
    id: 'it-streak-freeze',
    name: '连胜方冻',
    category: '道具',
    price: 260,
    currency: 'points',
    consumable: true,
    tag: '保连',
    desc: '漏打卡时自动消耗 1 个，保护一天连胜并提醒你回来学习。',
    color: '#38bdf8'
  }
]

export const formulas = {
  basic: [
    { id: 'f1', name: '右手小鱼', scene: '顶层棱块翻色，右手触发器入门', alg: "R U R' U'", cn: '右面顺时针，上层顺时针，右面逆时针，上层逆时针', known: false, wrong: false },
    { id: 'f2', name: '左手小鱼', scene: '左侧插入与镜像观察训练', alg: "L' U' L U", cn: '左面逆时针，上层逆时针，左面顺时针，上层顺时针', known: false, wrong: false }
  ],
  f2l: [
    { id: 'f3', name: '分离配对', scene: '角棱相连错误时先拆开再入槽', alg: "U R U' R'", cn: '上层顺时针，右面顺时针，上层逆时针，右面逆时针', known: false, wrong: false },
    { id: 'f4', name: '同色入槽', scene: '顶层同向成对后的右侧插入', alg: "U' R U R'", cn: '上层逆时针，右面顺时针，上层顺时针，右面逆时针', known: false, wrong: false }
  ],
  oll: [
    { id: 'f5', name: '点形 OLL', scene: '顶面无黄色棱块的高频情况', alg: "F R U R' U' F'", cn: '前面顺时针，右面顺时针，上层顺时针，右面逆时针，上层逆时针，前面逆时针', known: false, wrong: false }
  ],
  pll: [
    { id: 'f6', name: 'Ua Perm', scene: '三棱顺时针轮换', alg: "R U' R U R U R U' R' U' R2", cn: '右面顺时针，上层逆时针，右面顺时针，上层顺时针，右面顺时针，上层顺时针，右面顺时针，上层逆时针，右面逆时针，上层逆时针，右面转两次', known: false, wrong: false }
  ]
}

export const solves = [
  { id: 's1', rank: 1, time: '00:24.82', cube: '3x3', date: '今天 20:14' },
  { id: 's2', rank: 2, time: '00:27.31', cube: '3x3', date: '今天 20:08' },
  { id: 's3', rank: 3, time: '00:25.66', cube: '3x3', date: '今天 19:52' },
  { id: 's4', rank: 4, time: '00:31.04', cube: '3x3', date: '今天 19:41' },
  { id: 's5', rank: 5, time: '00:29.18', cube: '3x3', date: '今天 19:30' },
  { id: 's6', rank: 6, time: '00:26.97', cube: '3x3', date: '今天 19:18' },
  { id: 's7', rank: 7, time: '00:34.22', cube: '3x3', date: '今天 18:55' },
  { id: 's8', rank: 8, time: '00:28.46', cube: '3x3', date: '今天 18:40' },
  { id: 's9', rank: 9, time: '00:27.74', cube: '3x3', date: '今天 18:22' },
  { id: 's10', rank: 10, time: '00:30.65', cube: '3x3', date: '今天 18:03' }
]

export const bots = [
  { id: 'b1', name: '入门机器人', diff: '入门', points: 980, range: '55-70s', color: '#22c55e' },
  { id: 'b2', name: '进阶选手', diff: '进阶', points: 1880, range: '32-45s', color: '#f97316' },
  { id: 'b3', name: '速度大师', diff: '大师', points: 2980, range: '18-26s', color: '#ef4444' }
]

export const battleRecords = [
  { id: 'br1', result: '胜利', opponent: '进阶选手', score: '00:29.42', point: '+18' },
  { id: 'br2', result: '失败', opponent: '速度大师', score: '00:25.08', point: '-9' },
  { id: 'br3', result: '胜利', opponent: '入门机器人', score: '00:33.76', point: '+12' }
]

export const rankingUsers = [
  { id: 'u1', rank: 1, name: '冷启动', level: 28, value: '3860', avatar: '/static/logo.png' },
  { id: 'u2', rank: 2, name: '青色十字', level: 23, value: '3510', avatar: '/static/logo.png' },
  { id: 'u3', rank: 3, name: '橙面猎手', level: 21, value: '3288', avatar: '/static/logo.png' },
  { id: 'u4', rank: 4, name: 'PLL 闪电', level: 20, value: '3012', avatar: '/static/logo.png' },
  { id: 'u5', rank: 5, name: '星轨 Cubist', level: 12, value: '2480', avatar: '/static/logo.png', me: true },
  { id: 'u6', rank: 6, name: 'F2L 观察者', level: 15, value: '2394', avatar: '/static/logo.png' },
  { id: 'u7', rank: 7, name: '蓝块队长', level: 13, value: '2260', avatar: '/static/logo.png' }
]

export const rankingBoards = {
  score: rankingUsers,
  speed: [
    { id: 'u7', rank: 1, name: '蓝块队长', level: 13, value: '16.92s', avatar: '/static/logo.png' },
    { id: 'u4', rank: 2, name: 'PLL 闪电', level: 20, value: '18.40s', avatar: '/static/logo.png' },
    { id: 'u2', rank: 3, name: '青色十字', level: 23, value: '19.85s', avatar: '/static/logo.png' },
    { id: 'u5', rank: 4, name: '星轨 Cubist', level: 12, value: '24.82s', avatar: '/static/logo.png', me: true },
    { id: 'u1', rank: 5, name: '冷启动', level: 28, value: '25.66s', avatar: '/static/logo.png' },
    { id: 'u3', rank: 6, name: '橙面猎手', level: 21, value: '28.14s', avatar: '/static/logo.png' },
    { id: 'u6', rank: 7, name: 'F2L 观察者', level: 15, value: '31.08s', avatar: '/static/logo.png' }
  ],
  winRate: [
    { id: 'u5', rank: 1, name: '星轨 Cubist', level: 12, value: '89%', avatar: '/static/logo.png', me: true },
    { id: 'u1', rank: 2, name: '冷启动', level: 28, value: '86%', avatar: '/static/logo.png' },
    { id: 'u7', rank: 3, name: '蓝块队长', level: 13, value: '82%', avatar: '/static/logo.png' },
    { id: 'u2', rank: 4, name: '青色十字', level: 23, value: '75%', avatar: '/static/logo.png' },
    { id: 'u4', rank: 5, name: 'PLL 闪电', level: 20, value: '71%', avatar: '/static/logo.png' },
    { id: 'u6', rank: 6, name: 'F2L 观察者', level: 15, value: '68%', avatar: '/static/logo.png' },
    { id: 'u3', rank: 7, name: '橙面猎手', level: 21, value: '65%', avatar: '/static/logo.png' }
  ],
  practice: [
    { id: 'u6', rank: 1, name: 'F2L 观察者', level: 15, value: '680 次', avatar: '/static/logo.png' },
    { id: 'u1', rank: 2, name: '冷启动', level: 28, value: '620 次', avatar: '/static/logo.png' },
    { id: 'u5', rank: 3, name: '星轨 Cubist', level: 12, value: '386 次', avatar: '/static/logo.png', me: true },
    { id: 'u2', rank: 4, name: '青色十字', level: 23, value: '360 次', avatar: '/static/logo.png' },
    { id: 'u7', rank: 5, name: '蓝块队长', level: 13, value: '322 次', avatar: '/static/logo.png' },
    { id: 'u4', rank: 6, name: 'PLL 闪电', level: 20, value: '280 次', avatar: '/static/logo.png' },
    { id: 'u3', rank: 7, name: '橙面猎手', level: 21, value: '240 次', avatar: '/static/logo.png' }
  ],
  streak: [
    { id: 'u1', rank: 1, name: '冷启动', level: 28, value: '28 天', avatar: '/static/logo.png' },
    { id: 'u6', rank: 2, name: 'F2L 观察者', level: 15, value: '21 天', avatar: '/static/logo.png' },
    { id: 'u2', rank: 3, name: '青色十字', level: 23, value: '16 天', avatar: '/static/logo.png' },
    { id: 'u4', rank: 4, name: 'PLL 闪电', level: 20, value: '12 天', avatar: '/static/logo.png' },
    { id: 'u5', rank: 5, name: '星轨 Cubist', level: 12, value: '9 天', avatar: '/static/logo.png', me: true },
    { id: 'u7', rank: 6, name: '蓝块队长', level: 13, value: '7 天', avatar: '/static/logo.png' },
    { id: 'u3', rank: 7, name: '橙面猎手', level: 21, value: '5 天', avatar: '/static/logo.png' }
  ]
}

export const rankingSeason = {
  seasonNo: 12,
  nextSeasonNo: 13,
  currentLeague: '青铜成长榜',
  nextLeague: '白银进阶榜',
  deadline: '每周日 22:00',
  promoteCount: 5,
  levels: [
    { name: '青铜成长榜', active: true, color: '#22d3ee' },
    { name: '白银进阶榜', active: false, color: '#cbd5e1' },
    { name: '黄金竞速榜', active: false, color: '#facc15' },
    { name: '钻石大师榜', active: false, color: '#a855f7' },
    { name: '星耀宗师榜', active: false, color: '#38bdf8' },
    { name: '王者巅峰榜', active: false, color: '#f97316' },
    { name: '传奇冠军榜', active: false, color: '#ef4444' },
    { name: '魔方殿堂榜', active: false, color: '#22c55e' }
  ],
  rewards: [
    { from: '青铜成长榜', to: '白银进阶榜', points: 60, coins: 180, prize: '青焰头像框碎片 x1', color: '#22d3ee' },
    { from: '白银进阶榜', to: '黄金竞速榜', points: 120, coins: 360, prize: '紫电头像框碎片 x1', color: '#cbd5e1' },
    { from: '黄金竞速榜', to: '钻石大师榜', points: 220, coins: 680, prize: '金色连胜框碎片 x2', color: '#facc15' },
    { from: '钻石大师榜', to: '星耀宗师榜', points: 360, coins: 1080, prize: '深空星轨框碎片 x2', color: '#a855f7' },
    { from: '星耀宗师榜', to: '王者巅峰榜', points: 520, coins: 1580, prize: '限定称号：星耀魔手', color: '#38bdf8' },
    { from: '王者巅峰榜', to: '传奇冠军榜', points: 760, coins: 2280, prize: '赤焰冠军框碎片 x3', color: '#f97316' },
    { from: '传奇冠军榜', to: '魔方殿堂榜', points: 1000, coins: 3200, prize: '殿堂头像框兑换券', color: '#ef4444' }
  ]
}

export function getScramble(cube = '3x3') {
  const moves = cube === '2x2' ? ['R', 'U', 'F', "R'", "U'", "F'"] : ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'U2', 'F2']
  const length = cube === '2x2' ? 9 : cube === '3x3' ? 20 : 28
  const result = []
  for (let i = 0; i < length; i += 1) {
    result.push(moves[(i * 7 + cube.length * 3 + Date.now()) % moves.length])
  }
  return result.join(' ')
}

export const cubeColors = ['#ffffff', '#facc15', '#22c55e', '#2563eb', '#f97316', '#ef4444', '#a855f7', '#22d3ee', '#94a3b8']
