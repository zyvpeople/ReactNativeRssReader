import {NativeModules} from 'react-native'

const _nativeHttpClient = NativeModules.NativeHttpClient

export default class HativeHttpClient {

  get(url, headers) {
    return _nativeHttpClient.get(url, headers)
  }
}
