import { Model } from '@vuex-orm/core'

export default class Kajian extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'kajians'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      hari: this.attr(''),
      bahasan: this.attr(''),
      guru : this.attr([]),
      masjid: this.attr([]),
      jam_mulai : this.attr(''),
      jam_selesai : this.attr(''),
    }
  }
}