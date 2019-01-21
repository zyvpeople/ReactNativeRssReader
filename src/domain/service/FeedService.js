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
    this.feedsChangedObservable = new Observable()
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
    //TODO:
  }

  syncFeed(feedId) {
    if (this.isSync) {
      return
    }
    if (!this.networkService.isOnline) {
      return
    }
    this._setIsSyncAndNotify(true)
    //TODO:
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

  feedItems(feedId, searchText) {
    //TODO:
  }

  _setIsSyncAndNotify(isSync) {
    this.isSync = isSync
    this.syncStatusChangedObservable.onNext(null)
  }
}
