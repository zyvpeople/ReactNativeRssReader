import PublishSubject from '../../domain/common/PublishSubject'
import BehaviourSubject from '../../domain/common/BehaviourSubject'

export default class FeedItemsViewModel {

  constructor(feedId, feedService, router) {
    this.feedId = feedId
    this.feedService = feedService
    this.router = router
    this.feedItems = new BehaviourSubject([])
    this.progress = new BehaviourSubject(false)
    this.syncError = new PublishSubject()
    this.deleteFeedError = new PublishSubject()
    this._unsubscribeFeedItemsChanged = this
      .feedService
      .feedItemsChanged
      .subscribe(this._onFeedItemsChanged)
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
    this.feedService.syncFeed(this.feedId)
    this._onFeedItemsChanged()
    this._onSyncStatusChanged()
  }

  onDestroyed() {
    this._unsubscribeFeedItemsChanged()
    this._unsubscribeSyncStatusChanged()
    this._unsubscribeSyncError()
  }

  onRefresh = () => this.feedService.syncFeed(this.feedId)

  onFeedItemPressed = (component, feedItem) => this.router.goToFeedItem(component, feedItem.id)

  onDeleteFeedPressed(component) {
    this
      .feedService
      .removeFeed(this.feedId)
      .then(event => this.router.goBack(component))
      .catch(error => this.deleteFeedError.onNext(error))
  }

  _onFeedItemsChanged = () =>
    this
      .feedService
      .feedItems(this.feedId)
      .then(items => this.feedItems.onNext(items))

  _onSyncStatusChanged = () => this.progress.onNext(this.feedService.isSync)
}
