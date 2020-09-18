import { Model } from '@vuex-orm/core'

export default class Page extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'pages'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      current_page: this.attr(null),
      first_page_url :	this.attr(''),
      from : this.attr(null),
      last_page :	this.attr(null),
      last_page_url :	this.attr(''),
      next_page_url : 	this.attr(null),
      path : this.attr(''),
      per_page : this.attr(null),
      prev_page_url : this.attr(null),
      to :	this.attr(null),
      total	: this.attr(null),
    }
  }
}