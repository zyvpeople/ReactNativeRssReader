import Observable from '../../domain/common/Observable'

export default class AddFeedViewModel {

  constructor(feedService, router) {
    this.feedService = feedService
    this.router = router
    this.progress = new Observable()
    this.createFeedError = new Observable()
  }

  onCreated() {
    this.progress.onNext(false)
  }

  onDestroyed() {
  }

  onCreatePressed(component, feedUrl) {
    this.progress.onNext(true)
    this
      .feedService
      .createFeed(feedUrl)
      .then(event => {
        this.progress.onNext(false)
        this.router.goBack(component)
      })
      .catch(error => {
        this.progress.onNext(false)
        this.createFeedError.onNext(null)
      })
  }
}
