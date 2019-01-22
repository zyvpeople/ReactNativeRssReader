import OnlineStatusViewModel from './onlineStatus/OnlineStatusViewModel'
import FeedsViewModel from './feeds/FeedsViewModel'
import FeedItemsViewModel from './feedItems/FeedItemsViewModel'
import FeedItemViewModel from './feedItem/FeedItemViewModel'
import AddFeedViewModel from './addFeed/AddFeedViewModel'

export default class ViewModelFactory {

  constructor(networkService,
              feedService) {
    this.networkService = networkService
    this.feedService = feedService
  }

  onlineStatusViewModel() {
    return new OnlineStatusViewModel(this.networkService)
  }

  feedsViewModel(router) {
    return new FeedsViewModel(this.feedService, router)
  }

  feedItemsViewModel(feedId, router) {
    return new FeedItemsViewModel(feedId, this.feedService, router)
  }

  feedItemViewModel(feedItemId) {
    return new FeedItemViewModel(feedItemId, this.feedService)
  }

  addFeedViewModel(router) {
    return new AddFeedViewModel(this.feedService, router)
  }
}
