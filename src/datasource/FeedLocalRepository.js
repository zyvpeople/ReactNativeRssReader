import Observable from '../domain/common/Observable'
import Feed from '../domain/entity/Feed'
import FeedItem from '../domain/entity/FeedItem'

export class FeedLocalRepository {
  constructor(logger) {
    this.logger = logger
    this._feeds = [
      new Feed(0, "1", ""),
      new Feed(1, "2", ""),
      new Feed(2, "3", ""),
      new Feed(3, "4", ""),
      new Feed(4, "5", ""),
      new Feed(5, "6", "")
    ]
    this._feedItems = [
      new FeedItem(0, "0", "0", 0, "0", "0", 0),
      new FeedItem(1, "1", "1", 1, "1", "1", 1),
      new FeedItem(2, "2", "2", 2, "2", "2", 2),
      new FeedItem(3, "3", "3", 3, "3", "3", 3),
      new FeedItem(4, "4", "4", 4, "4", "4", 4),
      new FeedItem(5, "5", "5", 5, "5", "5", 5)
    ]
    this.feedsChangedObservable = new Observable()
    this.feedItemsChangedObservable = new Observable()
  }

  async createOrUpdateFeed(feed) {
    return feed
  }

  removeFeed(feedId) {
    //TODO:
  }

  async feeds() {
    return this._feeds
  }

  async feedWithUrlExists(feedUrl) {
    return false
  }

  async createOrUpdateFeedItems(feedItems) {
    return null
  }

  async feedItems(feedId) {
    return this._feedItems
  }

  async feedItem(feedItemId) {
    return new FeedItem(0, "0", "0", 0, "https://github.com/facebook/react-native/issues/19986", "0", 0)
  }
}
