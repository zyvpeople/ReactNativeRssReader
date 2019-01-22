import React, {Component} from "react";
import {createStackNavigator, createAppContainer} from 'react-navigation';
import FeedsComponent from '../feeds/FeedsComponent'
import FeedItemsComponent from '../feedItems/FeedItemsComponent'
import FeedItemComponent from '../feedItem/FeedItemComponent'
import AddFeedComponent from '../addFeed/AddFeedComponent'

export default class Router {

  constructor(viewModelFactory) {
    this.viewModelFactory = viewModelFactory
  }

  createNavigator() {
    return createAppContainer(
      createStackNavigator(
        {
          Feeds: {screen: this._injectIntoFeedsComponent(FeedsComponent)},
          FeedItems: {screen: this._injectIntoFeedItemsComponent(FeedItemsComponent)},
          FeedItem: {screen: this._injectIntoFeedItemComponent(FeedItemComponent)},
          AddFeed: {screen: this._injectIntoAddFeedComponent(AddFeedComponent)}
        },
        {
          initialRouteName: 'Feeds'
        })
    )
  }

  goToFeedItems(component, feedId) {
    component.props.navigation.navigate('FeedItems', { feedId: feedId })
  }

  goToFeedItem(component, feedItemId) {
    component.props.navigation.navigate('FeedItem', { feedItemId: feedItemId })
  }

  goToAddFeed(component) {
    component.props.navigation.navigate('AddFeed')
  }

  _injectIntoFeedsComponent = FeedsComponent => {
    const viewModelFactory = this.viewModelFactory
    const router = this
    return class extends Component {
      static navigationOptions = FeedsComponent.navigationOptions;
      render() {
        return (
          <FeedsComponent
            {...this.props}
            feedsViewModel={viewModelFactory.feedsViewModel(router)}
            onlineStatusViewModel={viewModelFactory.onlineStatusViewModel()}/>
        )
      }
    }
  }

  _injectIntoFeedItemsComponent = FeedItemsComponent => {
    const viewModelFactory = this.viewModelFactory
    const router = this
    return class extends Component {
      static navigationOptions = FeedItemsComponent.navigationOptions;
      render() {
        const feedId = this.props.navigation.getParam('feedId', 0)
        return (
          <FeedItemsComponent
            {...this.props}
            feedItemsViewModel={viewModelFactory.feedItemsViewModel(feedId, router)}
            onlineStatusViewModel={viewModelFactory.onlineStatusViewModel()}/>
        )
      }
    }
  }

  _injectIntoFeedItemComponent = FeedItemComponent => {
    const viewModelFactory = this.viewModelFactory
    return class extends Component {
      static navigationOptions = FeedItemComponent.navigationOptions;
      render() {
        const feedItemId = this.props.navigation.getParam('feedItemId', 0)
        return (
          <FeedItemComponent
            {...this.props}
            feedItemViewModel={viewModelFactory.feedItemViewModel(feedItemId)}/>
        )
      }
    }
  }

  _injectIntoAddFeedComponent = AddFeedComponent => {
    const viewModelFactory = this.viewModelFactory
    return class extends Component {
      static navigationOptions = AddFeedComponent.navigationOptions;
      render() {
        return (
          <AddFeedComponent
            {...this.props}
            addFeedViewModel={viewModelFactory.addFeedViewModel()}/>
        )
      }
    }
  }
}
