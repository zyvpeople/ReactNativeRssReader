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
    // this
    //   .feedLocalRepository
    //   .feeds()
    //   .then(feeds => {
    //
    //   })
    // [self.feedRemoteRepository feedItemsForFeedUrl:feedUrl completion:[[^(NSArray<FeedItemRemoteDto *> *feedItemRemoteDtos, NSError *error) {
    //         if (!error) {
    //             NSArray<FeedItemRemoteDto *> *validDtos = [weakSelf filterValidFeedItemRemoteDtos:feedItemRemoteDtos];
    //             [weakSelf.feedLocalRepository saveFeedItems:validDtos forFeedUrl:feedUrl completion:[[^(NSError *error) {
    //                 [weakSelf setIsSyncAndNotify:NO];
    //                 if (error) {
    //                     [weakSelf.logger errorWithError:error
    //                                             message:@"Error save feed items into local repository"];
    //                     [weakSelf notifyOnSyncFailed:error];
    //                 }
    //             } copy] autorelease]];
    //         } else {
    //             [weakSelf.logger errorWithError:error
    //                                     message:@"Error load feed items from remote repository"];
    //             [weakSelf setIsSyncAndNotify:NO];
    //             [weakSelf notifyOnSyncFailed:error];
    //         }
    //     } copy] autorelease]];

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

  async feeds() {
    return this.feedLocalRepository.feeds()
  }

  async feedItems(feedId) {
    return this.feedLocalRepository.feedItems(feedId)
  }

  async feedItem(feedItemId) {
    return this.feedLocalRepository.feedItem(feedItemId)
  }

  _setIsSyncAndNotify(isSync) {
    this.isSync = isSync
    this.syncStatusChangedObservable.onNext(null)
  }
}
