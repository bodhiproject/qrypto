import { observable } from 'mobx'

class HomeStore {
  @observable public settingsMenuAnchor
}

export default new HomeStore()
