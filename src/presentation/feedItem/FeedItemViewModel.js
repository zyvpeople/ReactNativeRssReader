import PublishSubject from '../../domain/common/PublishSubject'
import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class FeedItemViewModel {

  constructor(feedItemId, feedService, router) {
    this.feedItemId = feedItemId
    this.feedService = feedService
    this.router = router
    this.feedItem = new BehaviourSubject(null)
    this.loadFeedItemError = new PublishSubject()
    this.shareUrl = new PublishSubject()
  }

  onCreated() {
    this
      .feedService
      .findFeedItem(this.feedItemId)
      .then(item => {
        this._feedItem = item
        this.feedItem.onNext(item)
        if (item === null) {
          this.loadFeedItemError.onNext(null)
        }
      })
      .catch(error => this.loadFeedItemError.onNext(null))
  }

  onDestroyed() {
  }

  onOpenInBrowserPressed(component) {
    if (this._feedItem === null) {
      return
    }
    this.router.goToBrowser(component, this._feedItem.url)
  }

  onSharePressed() {
    if (this._feedItem === null) {
      return
    }
    this.shareUrl.onNext(this._feedItem.url)
  }
}
