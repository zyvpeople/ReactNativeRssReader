import Observable from '../common/Observable'
import { NetInfo, ConnectionType } from 'react-native'

export default class NetworkService {
  constructor() {
    this.onlineStatusChanged = new Observable()
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
    this.isOnline = isConnected
    this.onlineStatusChanged.onNext(null)
  }
}
