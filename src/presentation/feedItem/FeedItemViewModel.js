import Observable from '../../domain/common/Observable'

export default class FeedItemViewModel {

  constructor(feedItemId, feedService) {
    this.feedItemId = feedItemId
    this.feedService = feedService
    this.feedItem = new Observable()
    this.loadFeedItemError = new Observable()
  }

  onCreated() {
    this
      .feedService
      .feedItem(this.feedItemId)
      .then(item => this.feedItem.onNext(item))
      .catch(error => this.loadFeedItemError.onNext(null))
  }

  onDestroyed() {
  }
}
