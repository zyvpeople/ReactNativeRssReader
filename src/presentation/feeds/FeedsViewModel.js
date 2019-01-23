import Observable from '../../domain/common/Observable'

export default class FeedsViewModel {

  constructor(feedService, router) {
    this.feedService = feedService
    this.router = router
    this.feeds = new Observable()
    this.progress = new Observable()
    this.syncError = new Observable()
    this._unsubscribeFeedsChanged = this
      .feedService
      .feedsChangedObservable
      .subscribe(this._onFeedsChanged)
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
    this.feedService.syncAll()
    this._onFeedsChanged()
    this._onSyncStatusChanged()
  }

  onDestroyed() {
    this._unsubscribeFeedsChanged()
    this._unsubscribeSyncStatusChanged()
    this._unsubscribeSyncError()
  }

  onRefresh = () => {
    this.feedService.syncAll()
  }

  onFeedPressed = (component, feed) => {
    this.router.goToFeedItems(component, feed.id)
  }

  onAddFeedPressed(component) {
    this.router.goToAddFeed(component)
  }

  _onFeedsChanged = () => {
    this
      .feedService
      .feeds()
      .then(items => this.feeds.onNext(items))
  }

  _onSyncStatusChanged = () => {
    this.progress.onNext(this.feedService.isSync)
  }
}
