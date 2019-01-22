import Observable from '../../domain/common/Observable'

export default class FeedItemsViewModel {

  constructor(feedId, feedService, router) {
    this.feedId = feedId
    this.feedService = feedService
    this.router = router
    this.feedItems = new Observable()
    this.progress = new Observable()
    this.syncError = new Observable()
    this._unsubscribeFeedItemsChanged = this
      .feedService
      .feedItemsChangedObservable
      .subscribe(this._onFeedItemsChanged)
    this._unsubscribeSyncStatusChanged = this
      .feedService
      .syncStatusChangedObservable
      .subscribe(this._onSyncStatusChanged)
    this._unsubscribeSyncError = this
      .feedService
      .syncErrorObservable
      .subscribe(() => this.syncError.onNext(null))
  }

  onCreated() {
    this._onFeedItemsChanged()
    this._onSyncStatusChanged()
  }

  onDestroyed() {
    this._unsubscribeFeedItemsChanged()
    this._unsubscribeSyncStatusChanged()
    this._unsubscribeSyncError()
  }

  onRefresh = () => {
    this.feedService.syncFeed(this.feedId)
  }

  onFeedItemPressed = (component, feedItem) => {
    this.router.goToFeedItem(component, feedItem.id)
  }

  _onFeedItemsChanged = () => {
    this
      .feedService
      .feedItems(this.feedId)
      .then(items => this.feedItems.onNext(items))
  }

  _onSyncStatusChanged = () => {
    this.progress.onNext(this.feedService.isSync)
  }
}
