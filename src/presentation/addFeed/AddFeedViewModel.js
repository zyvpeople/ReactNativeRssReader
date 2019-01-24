import PublishSubject from '../../domain/common/PublishSubject'
import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class AddFeedViewModel {

  constructor(feedService, router) {
    this.feedService = feedService
    this.router = router
    this.progress = new BehaviourSubject(false)
    this.createFeedError = new PublishSubject()
  }

  onCreated() {
  }

  onDestroyed() {
  }

  onCreatePressed(feedUrl) {
    this.progress.onNext(true)
    this
      .feedService
      .createFeed(feedUrl)
      .then(event => {
        this.progress.onNext(false)
        this.router.goBack()
      })
      .catch(error => {
        this.progress.onNext(false)
        this.createFeedError.onNext(null)
      })
  }
}
