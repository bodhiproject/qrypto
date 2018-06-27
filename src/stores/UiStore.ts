import { observable } from 'mobx';

class UiStore {
  // TODO: @observable locale (but this is for language)
  @observable public prevLocation: string = '/';
  @observable public settingsMenuAnchor;
}

export default new UiStore();
