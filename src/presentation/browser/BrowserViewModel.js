import PublishSubject from '../../domain/common/PublishSubject'
import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class BrowserViewModel {

  constructor(url, router) {
    this.router = router
    this.url = new BehaviourSubject(url)
    this.progress = new BehaviourSubject(false)
    this.loadError = new PublishSubject()
  }

  onCreated() {
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
