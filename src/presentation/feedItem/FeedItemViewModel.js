import Observable from '../../domain/common/Observable'

export default class FeedItemViewModel {

  constructor(feedItemId, feedService, router) {
    this.feedItemId = feedItemId
    this.feedService = feedService
    this.router = router
    this.feedItem = new Observable()
    this.loadFeedItemError = new Observable()
    this.shareUrl = new Observable()
  }

  onCreated() {
    this
      .feedService
      .feedItem(this.feedItemId)
      .then(item => {
        this._feedItem = item
        this.feedItem.onNext(item)
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
