import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: "",
    database: { db_name: '', rights: '', id: null },
    expirationTime: 1800,
    display: true,
    response: null,
    isAdmin: false
  },
  mutations: {
    setInverted(state) {
      state.display = !(state.display)
    },
    setDatabase(state, value) {
      state.database.db_name = value.db_name
      state.database.rights = value.rights
      state.database.id = value.id
    },
    setExpirationTime(state, value) {
      state.expirationTime = value;
    },
    SET_TOKEN(state, value) {
      state.token = value;
    },
    IS_ADMIN(state, value) {
      console.log("test", value)

      state.isAdmin = value;
    }
  },
  actions: {
    patchInverted(context) {
      context.commit('setInverted')
    },
    patchDatabase(context, value) {
      context.commit('setDatabase', value)
    },
    patchExpirationTime(context) {
      context.commit('setExpirationTime')
    }
  },
  modules: {
  },
  getters: {
    token(state) {
      return state.token;
    },
    database(state) {
      return state.database;
    },
    display(state) {
      return state.display;
    },
    expirationTime(state) {
      return state.expirationTime;
    },
    isAdmin(state) {
      return state.isAdmin;
    }
  }
})

export default store