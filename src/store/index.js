import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from 'models/User'
import Guru from 'models/Guru'
import Kajian from 'models/Kajian'
import Page from 'models/Page'
import Masjid from 'models/Masjid'

Vue.use(Vuex)

// Create a new instance of Database.
const database = new VuexORM.Database()

// Register Models to Database.
database.register(User)
database.register(Guru)
database.register(Kajian)
database.register(Page)
database.register(Masjid)

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