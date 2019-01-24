import PublishSubject from '../../domain/common/PublishSubject'
import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class FeedsViewModel {

  constructor(feedService, router) {
    this.feedService = feedService
    this.router = router
    this.feeds = new BehaviourSubject([])
    this.progress = new BehaviourSubject(false)
    this.syncError = new PublishSubject()
    this._unsubscribeFeedsChanged = this
      .feedService
      .feedsChanged
      .subscribe(this._onFeedsChanged)
    this._unsubscribeSyncStatusChanged = this
      .feedService
      .syncStatusChanged
      .subscribe(this._onSyncStatusChanged)
  }

  onCreated() {
    this._unsubscribeSyncError = this
      .feedService
      .syncError
      .subscribe(() => this.syncError.onNext(null))
    this.feedService.syncAll()
    this._onFeedsChanged()
    this._onSyncStatusChanged()
  }

  onDestroyed() {
    this._unsubscribeFeedsChanged()
    this._unsubscribeSyncStatusChanged()
    this._unsubscribeSyncError()
  }

  onRefresh = () => this.feedService.syncAll()

  onFeedPressed = (component, feed) => this.router.goToFeedItems(component, feed.id)

  onAddFeedPressed(component) {
    this.router.goToAddFeed(component)
  }

  _onFeedsChanged = () =>
    this
      .feedService
      .feeds()
      .then(items => this.feeds.onNext(items))

  _onSyncStatusChanged = () => this.progress.onNext(this.feedService.isSync)
}
