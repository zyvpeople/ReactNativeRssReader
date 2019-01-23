import Observable from '../domain/common/Observable'
import Feed from '../domain/entity/Feed'
import FeedItem from '../domain/entity/FeedItem'

export class FeedLocalRepository {
  constructor(logger) {
    this.logger = logger
    this._feeds = [
      new Feed(0, "1", "http://feeds.bbci.co.uk/news/rss.xml"),
      new Feed(1, "2", "http://feeds.bbci.co.uk/news/world/rss.xml"),
      new Feed(2, "3", "http://feeds.bbci.co.uk/news/uk/rss.xml")
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

  async removeFeed(feedId) {
    return null
  }

  async feeds() {
    return this._feeds
  }

  async findFeed(feedId) {
    return null
    // return new Feed(0, "1", "http://feeds.bbci.co.uk/news/rss.xml")
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

  async findFeedItem(feedItemId) {
    return new FeedItem(
      0,
      "Title",
      "Summary Summary Summary Summary Summary Summary Summary Summary Summary Summary ",
      0,
      "https://github.com/facebook/react-native/issues/19986",
      "https://1.bp.blogspot.com/-_0JXDpvIF1U/WaxcVIT7HxI/AAAAAAAAAnM/gSfCaKXo79ACEHN2LiERWPUV4nSGyYcsACLcBGAs/s1600/4_fraktal3608ab310dc594c738706a02f4962899f.jpg",
      0)
  }
}
