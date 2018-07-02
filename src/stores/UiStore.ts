import { observable } from 'mobx';

class UiStore {
  // TODO: @observable locale (but this is for language)
  @observable public settingsMenuAnchor;
}

export default new UiStore();
