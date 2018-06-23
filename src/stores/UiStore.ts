import { observable } from 'mobx'


class UiStore {
  // TODO: @observable locale (but this is for language)
  @observable prevLocation:string = '/'
}

export default new UiStore()