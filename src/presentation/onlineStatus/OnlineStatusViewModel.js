import Observable from '../../domain/common/Observable'

export default class OnlineStatusViewModel {

  constructor(networkService) {
    this.networkService = networkService
    this.visible = new Observable()
    this.unsubscribeOnOnlineStatusChanged = this
      .networkService
      .onlineStatusChanged
      .subscribe(this._onOnlineStatusChanged)
  }

  onCreated() {
    this._onOnlineStatusChanged()
  }

  onDestroyed() {
    this.unsubscribeOnOnlineStatusChanged()
  }

  _onOnlineStatusChanged = () => {
    this.visible.onNext(!this.networkService.isOnline)
  }
}
