import React, {Component} from 'react'
import {StyleSheet, FlatList, View, Text, TouchableOpacity, Alert, Image} from 'react-native'
import OnlineStatusComponent from '../onlineStatus/OnlineStatusComponent'
import {strings} from '../resources/locales/i18n'

export default class FeedItemsComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: strings('feedItems'),
      headerRight: (
        <TouchableOpacity
          onPress={ () => navigation.getParam('onDeleteFeedPressed')()}>
          <Image
            style={styles.icon}
            source={require('../resources/images/delete.png')}/>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.feedItemsViewModel = this.props.navigation.getParam("feedItemsViewModel")
    this.onlineStatusViewModel = this.props.navigation.getParam("onlineStatusViewModel")
    this.state = {
      feedItems: [],
      refreshing: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onDeleteFeedPressed: this._onDeleteFeedPressed });
    this.unsubscribeFromFeedItems = this
      .feedItemsViewModel
      .feedItems
      .subscribe(feedItems => this.setState({ feedItems: feedItems }))
    this.unsubscribeFromProgress = this
      .feedItemsViewModel
      .progress
      .subscribe(progress => this.setState({ refreshing: progress }))
    this.unsubscribeFromSyncError = this
      .feedItemsViewModel
      .syncError
      .subscribe(event =>
        Alert.alert(
          strings('error'),
          strings('errorSyncFeed'),
          [{text:strings('ok')}]))
    this.unsubscribeFromDeleteFeedError = this
      .feedItemsViewModel
      .deleteFeedError
      .subscribe(event =>
        Alert.alert(
          strings('error'),
          strings('errorDeleteFeed'),
          [{text:strings('ok')}]))
    this.feedItemsViewModel.onCreated()
  }

  componentWillUnmount() {
    this.feedItemsViewModel.onDestroyed()
    this.unsubscribeFromFeedItems()
    this.unsubscribeFromProgress()
    this.unsubscribeFromSyncError()
    this.unsubscribeFromDeleteFeedError()
  }

  render() {
    return (
      <View
        style={styles.container}>
        <OnlineStatusComponent
          onlineStatusViewModel={this.onlineStatusViewModel}/>
        <FlatList
          style={styles.list}
          data={this.state.feedItems}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          refreshing={this.state.refreshing}
          onRefresh={() => this.feedItemsViewModel.onRefresh()}/>
      </View>
    )
  }

  _keyExtractor = (item, index) => `${item.id}`

  _renderItem = ({item}) =>
    <TouchableOpacity
      onPress={() => this.feedItemsViewModel.onFeedItemPressed(item)}>
        <View
          style={styles.item}>
          <Image
            style={styles.image}
            source={{uri:item.imageUrl}}/>
          <Text
            style={styles.text}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.title}
          </Text>
        </View>
    </TouchableOpacity>

  _onDeleteFeedPressed = () => this.feedItemsViewModel.onDeleteFeedPressed()
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8
  },
  item: {
    height: 48,
    flexDirection: 'row',
    marginStart: 16,
    marginEnd: 16
  },
  image: {
    height: 36,
    width: 36
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginStart: 16
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 8
  }
})
