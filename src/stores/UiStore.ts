import { observable } from 'mobx';

export default class UiStore {
  // TODO: @observable locale (but this is for language)
  @observable public settingsMenuAnchor?: string = undefined;
}
