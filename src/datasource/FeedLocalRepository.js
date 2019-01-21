import Observable from '../domain/common/Observable'

export class FeedLocalRepository {
  constructor(logger) {
    this.logger = logger
    this.feedsChangedObservable = new Observable()
    this.feedItemsChangedObservable = new Observable()
  }

  createFeed(feed) {
    //TODO:
  }

  removeFeed(feedId) {
    //TODO:
  }

  feeds() {
    //TODO:
  }

  createOrUpdateFeedItems(feedId, feedItems) {
    //TODO:
  }

  feedItems(feedId) {
    //TODO:
  }
}
