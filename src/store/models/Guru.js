import { Model } from '@vuex-orm/core'

export default class Guru extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'gurus'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      hp: this.attr(''),
      nama: this.attr(''),
      profile: this.attr(''),
      tempat_lahir: this.attr(''),
      tgl_lahir: this.attr(''),
      fb: this.attr(''),
      twitter: this.attr(''),
      youtube: this.attr(''),
      instagram: this.attr(''),
      lulusan: this.attr(''),
      foto: this.attr(''),
      created_at: this.attr('').nullable(),
      updated_at: this.attr(''),
      kajian: this.attr([{}]).nullable()
    }
  }
}