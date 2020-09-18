import { Model } from '@vuex-orm/core'

export default class Masjid extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'masjids'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      nama: this.attr(''),
      jenis : this.attr(''),
      profil: this.attr(''),
      alamat : this.attr([]),
      foto : this.attr([]),
      kajian : this.attr([]),
    }
  }
}