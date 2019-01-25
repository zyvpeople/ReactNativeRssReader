import PublishSubject from '../common/PublishSubject'
import { NetInfo, ConnectionType } from 'react-native'

export default class NetworkService {
  constructor() {
    this.onlineStatusChanged = new PublishSubject()
    this.isOnline = false
    NetInfo
      .isConnected
      .addEventListener(
        'connectionChange',
        this._handleConnectionStateChanged)
    NetInfo
      .isConnected
      .fetch()
      .then(this._handleConnectionStateChanged)
  }

  _handleConnectionStateChanged = isConnected => {
    if (this.isOnline == isConnected) {
      return
    }
    this.isOnline = isConnected
    this.onlineStatusChanged.onNext(null)
  }
}
