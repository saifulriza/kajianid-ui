import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from 'models/User'


Vue.use(Vuex)

// Create a new instance of Database.
const database = new VuexORM.Database()

// Register Models to Database.
database.register(User)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    plugins: [VuexORM.install(database)],
    modules: {
      // then we reference it
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.NODE_ENV !== 'production'
  })


  return Store
}