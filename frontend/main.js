import App from './App.vue'
import { i18nMixin, t } from './common/i18n.js'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.mixin(i18nMixin)
Vue.prototype.$t = t
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(i18nMixin)
  app.config.globalProperties.$t = t
  return {
    app
  }
}
// #endif
