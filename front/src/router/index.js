import Vue from 'vue'
import VueRouter from 'vue-router'
import { check_token } from '../modules/check_token.js'
import store from '../store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'TableDynamic',
    component: () => import('../views/Databases.vue')
  },
  {
    path: '/validate/:id',
    name: 'Validate',
    component: () => import('../views/Validate.vue')
  },
  {
    path: '/public/error',
    name: 'Error',
    component: () => import('../views/Error.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Administration.vue')
  },
  {
    path: '/admin/users',
    name: 'Admin Users',
    component: () => import('../views/AdminUsers.vue')
  },
  {
    path: '/admin/database',
    name: 'Admin Database',
    component: () => import('../views/AdminDatabase.vue')
  },
  {
    path: '/admin/dbusers',
    name: 'Admin Database User',
    component: () => import('../views/AdminDBUsers.vue')
  },
  {
    path: '/admin/rights',
    name: 'Admin Database Rights',
    component: () => import('../views/AdminRights.vue')
  },
  {
    path: '/admin/active',
    name: 'Admin Active',
    component: () => import('../views/AdminActive.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (store.state.token.length !== 0) {
    console.log("here I am", store.state.token);
    //console.log(axios.defaults.headers);
    next();

  } else {

    let res = await check_token();
    console.log(res)
    router.app.$store.commit('SET_TOKEN', res.access_token)
    router.app.$store.commit('IS_ADMIN', res.response.data.isAdmin)
    if (res === 401) {
      next(false)
    } else
      next();
  }
});


export default router
