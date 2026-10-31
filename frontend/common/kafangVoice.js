export const kafangVoicePacks = {
  guide: [
    '咔哒咔哒，先看目标，不要乱转哦。',
    '跟紧我呀，我会把路线亮给你看。',
    '这一关不难，深呼吸，咔方陪你稳稳来。'
  ],
  practice: [
    '小手放稳，打乱公式看两遍，咔，准备好啦。',
    '开始啦，别慌别慌，我在旁边给你数拍子。',
    '哇，复原完成，我要原地跳三下。'
  ],
  lesson: [
    '这一步先看棱块方向哦，眼睛先跑，手再跑。',
    '暂停一下，慢慢转两遍，咔方给你鼓掌。',
    '公式不是魔法，是小机关，看懂了就超厉害。'
  ],
  battle: [
    '对手锁定啦，气势鼓起来，不能输。',
    'GO，GO，GO，我喊开始，你负责帅气赢。',
    '没关系，下局我把眼睛睁大，帮你盯紧。'
  ],
  shop: [
    '金币别乱花哦，先换最闪的有用装备。',
    '这个好帅呀，但买完也要练习。',
    '买完回去训练，不许偷偷躺平。'
  ],
  profile: [
    '你的进步我都记着呢，一格一格变亮啦。',
    '打卡别断哦，我会趴在日历旁边盯着。',
    '徽章还差几块，继续冲呀，马上就酷起来。'
  ],
  settings: [
    '主题、语言、音乐，我来帮你咔咔调好。',
    '白天用浅色，开战用深色，气氛一下就来了。',
    '音乐调舒服一点，手速才会偷偷变快。'
  ],
  cheer: [
    '咔，这一下好帅，我眉毛都飞起来了。',
    '哇，进步被我看见啦，亮一格。',
    '别停别停，手感回来啦，继续冲。'
  ]
}

let cachedVoice = null

export function getKafangLine(pack = 'guide', index = 0) {
  const list = kafangVoicePacks[pack] || kafangVoicePacks.guide
  return list[index % list.length]
}

function getChildLikeVoice() {
  if (cachedVoice) return cachedVoice
  if (typeof speechSynthesis === 'undefined' || !speechSynthesis.getVoices) return null
  const voices = speechSynthesis.getVoices() || []
  const zhVoices = voices.filter(voice => /zh|Chinese|Mandarin|普通话|中文/i.test(`${voice.lang} ${voice.name}`))
  const playfulNames = /xiaoxiao|xiaoyi|xiaobei|tingting|meijia|yaoyao|hanhan|child|kid|female|girl|童|女/i
  cachedVoice = zhVoices.find(voice => playfulNames.test(voice.name)) || zhVoices[0] || voices.find(voice => playfulNames.test(voice.name)) || null
  return cachedVoice
}

function makePlayfulText(text) {
  const clean = String(text || '').trim()
  if (!clean) return '咔哒，我在这里呀。'
  const prefix = /^(咔|哇|GO|开始|没关系)/.test(clean) ? '' : '咔哒。'
  return `${prefix}${clean.replace(/，/g, '，嗯，').replace(/。$/g, '。嘿嘿。')}`
}

export function speakKafang(text) {
  try {
    if (typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined') {
      speechSynthesis.cancel()
      speechSynthesis.resume && speechSynthesis.resume()
      const utterance = new SpeechSynthesisUtterance(makePlayfulText(text))
      utterance.lang = 'zh-CN'
      utterance.voice = getChildLikeVoice()
      utterance.rate = 1.13
      utterance.pitch = 1.95
      utterance.volume = 0.96
      speechSynthesis.speak(utterance)
      return true
    }
  } catch (error) {}
  return false
}
