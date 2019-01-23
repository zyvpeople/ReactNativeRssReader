import Observable from '../common/Observable'

export class FeedService {
  constructor(feedLocalRepository,
              feedRemoteRepository,
              networkService,
              logger) {
    this.feedLocalRepository = feedLocalRepository
    this.feedRemoteRepository = feedRemoteRepository
    this.networkService = networkService
    this.logger = logger
    this.feedsChangedObservable = feedLocalRepository.feedsChangedObservable
    this.feedItemsChangedObservable = new Observable()
    this.syncStatusChangedObservable = new Observable()
    this.syncErrorObservable = new Observable()
    this.isSync = false
    networkService
      .onlineStatusChanged
      .subscribe(() => {
        if (networkService.isOnline) {
          this.syncAll()
        }
      })
  }

  syncAll() {
    if (this.isSync) {
      return
    }
    if (!this.networkService.isOnline) {
      return
    }
    this._setIsSyncAndNotify(true)
    this
      .feedLocalRepository
      .feeds()
      .then(feeds => Promise.all(feeds.map(async (feed) => this._syncFeed(feed))))
      .then(event => this._setIsSyncAndNotify(false))
      .catch(error => {
        this._setIsSyncAndNotify(false)
        this.syncErrorObservable.onNext(error)
      })
  }

  syncFeed(feedId) {
    if (this.isSync) {
      return
    }
    if (!this.networkService.isOnline) {
      return
    }
    this._setIsSyncAndNotify(true)
    this
      .feedLocalRepository
      .findFeed(feedId)
      .then(feed => feed === null ? Promise.resolve(null) : this._syncFeed(feed))
      .then(event => this._setIsSyncAndNotify(false))
      .catch(error => {
        this._setIsSyncAndNotify(false)
        this.syncErrorObservable.onNext(error)
      })
  }

  async _syncFeed(feed) {
    const feedAndFeedItems = await this.feedRemoteRepository.feedAndFeedItems(feed.url)
    var feedItems = feedAndFeedItems.feedItems
    feedItems.forEach(item => {item.feedId = feed.id})
    await this.feedLocalRepository.createOrUpdateFeedItems(feedItems)
  }

  async createFeed(feedUrl) {
    if (feedUrl === '') {
      throw "Feed url is empty"
    }
    let exists = await this.feedLocalRepository.feedWithUrlExists(feedUrl)
    if (exists) {
      return
    }
    let feedAndFeedItems = await this.feedRemoteRepository.feedAndFeedItems(feedUrl)
    let feed = await this.feedLocalRepository.createOrUpdateFeed(feedAndFeedItems.feed)
    var feedItems = feedAndFeedItems.feedItems
    feedItems.forEach(item => {item.feedId = feed.id})
    await this.feedLocalRepository.createOrUpdateFeedItems(feedItems)
  }

  async removeFeed(feedId) {
    return this.feedLocalRepository.removeFeed(feedId)
  }

  async feeds() {
    return this.feedLocalRepository.feeds()
  }

  async feedItems(feedId) {
    return this.feedLocalRepository.feedItems(feedId)
  }

  async findFeedItem(feedItemId) {
    return this.feedLocalRepository.findFeedItem(feedItemId)
  }

  _setIsSyncAndNotify(isSync) {
    this.isSync = isSync
    this.syncStatusChangedObservable.onNext(null)
  }
}
