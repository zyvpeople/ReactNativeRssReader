import React, {Component} from "react";
import {createStackNavigator, createAppContainer, NavigationActions} from 'react-navigation';
import FeedsComponent from '../feeds/FeedsComponent'
import FeedItemsComponent from '../feedItems/FeedItemsComponent'
import FeedItemComponent from '../feedItem/FeedItemComponent'
import AddFeedComponent from '../addFeed/AddFeedComponent'
import BrowserComponent from '../browser/BrowserComponent'

export default class Router {

  constructor(viewModelFactory) {
    this._viewModelFactory = viewModelFactory
    const stackNavigator = createStackNavigator({
      Feeds: {screen: this._injectIntoFeedsComponent(FeedsComponent)},
      FeedItems: {screen: FeedItemsComponent},
      FeedItem: {screen: FeedItemComponent},
      AddFeed: {screen: AddFeedComponent},
      Browser: {screen: BrowserComponent}
    },{
      initialRouteName: 'Feeds'
    })
    this._appContainer = createAppContainer(stackNavigator)
  }

  component() {
    const AppContainer = this._appContainer
    const setNavigator = navigatorRef => this._navigator = navigatorRef
    return class extends Component {
      render() {
        return (<AppContainer ref={setNavigator}/>)
      }
    }
  }

  goToFeedItems(feedId) {
    this._navigate('FeedItems', {
      feedItemsViewModel: this._viewModelFactory.feedItemsViewModel(feedId, this),
      onlineStatusViewModel: this._viewModelFactory.onlineStatusViewModel()
    })
  }

  goToFeedItem(feedItemId) {
    this._navigate('FeedItem', {
      feedItemViewModel: this._viewModelFactory.feedItemViewModel(feedItemId, this)
    })
  }

  goToAddFeed() {
    this._navigate('AddFeed', {
      addFeedViewModel: this._viewModelFactory.addFeedViewModel(this)
    })
  }

  goToBrowser(url) {
    this._navigate('Browser', {
      browserViewModel: this._viewModelFactory.browserViewModel(url, this)
    })
  }

  goBack() {
    this._navigator.dispatch(NavigationActions.back())
  }

  _injectIntoFeedsComponent = FeedsComponent => {
    const feedsViewModel = this._viewModelFactory.feedsViewModel(this)
    const onlineStatusViewModel = this._viewModelFactory.onlineStatusViewModel()
    return class extends Component {
      static navigationOptions = FeedsComponent.navigationOptions
      render() {
        return (
          <FeedsComponent
            {...this.props}
            feedsViewModel={feedsViewModel}
            onlineStatusViewModel={onlineStatusViewModel}/>
        )
      }
    }
  }

  _navigate(routeName, params) {
    this._navigator.dispatch(NavigationActions.navigate({routeName,params}))
  }
}
