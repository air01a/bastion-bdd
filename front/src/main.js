import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.component('listDB', require('./components/ListDB.vue').default);
Vue.component('listUsers', require('./components/ListUsers.vue').default);
Vue.component('listRole', require('./components/ListRole.vue').default);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
