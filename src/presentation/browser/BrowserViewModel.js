import Observable from '../../domain/common/Observable'

export default class BrowserViewModel {

  constructor(url, router) {
    this._url = url
    this.router = router
    this.url = new Observable()
    this.progress = new Observable()
    this.loadError = new Observable()
  }

  onCreated() {
    this.url.onNext(this._url)
    this.progress.onNext(false)
  }

  onDestroyed() {
  }

  onLoadStart() {
    this.progress.onNext(true)
  }

  onLoad() {
    this.progress.onNext(false)
  }

  onError() {
    this.progress.onNext(false)
    this.loadError.onNext(null)
  }
}
