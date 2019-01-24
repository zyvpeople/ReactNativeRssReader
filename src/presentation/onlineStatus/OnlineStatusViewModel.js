import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class OnlineStatusViewModel {

  constructor(networkService) {
    this.networkService = networkService
    this.visible = new BehaviourSubject(false)
    this.unsubscribeOnOnlineStatusChanged = this
      .networkService
      .onlineStatusChanged
      .subscribe(this._onOnlineStatusChanged)
    this._onOnlineStatusChanged()
  }

  onCreated() {
  }

  onDestroyed() {
    this.unsubscribeOnOnlineStatusChanged()
  }

  _onOnlineStatusChanged = () => this.visible.onNext(!this.networkService.isOnline)
}
