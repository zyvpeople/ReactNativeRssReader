import React, {Component} from 'react'
import {StyleSheet, FlatList, View, Text, TouchableOpacity, Alert, Image} from 'react-native'
import OnlineStatusComponent from '../onlineStatus/OnlineStatusComponent'
import {strings} from '../resources/locales/i18n'

export default class FeedsComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: strings("feeds"),
      headerRight: (
        <TouchableOpacity
          onPress={ () => navigation.getParam('onAddFeedPressed')()}>
          <Image
            style={styles.icon}
            source={require('../resources/images/add.png')}/>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.feedsViewModel = this.props.feedsViewModel
    this.onlineStatusViewModel = this.props.onlineStatusViewModel
    this.state = {
      feeds: [],
      refreshing: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onAddFeedPressed: this._onAddFeedPressed });
    this.unsubscribeFromFeeds = this
      .feedsViewModel
      .feeds
      .subscribe(feeds => this.setState({ feeds: feeds }))
    this.unsubscribeFromProgress = this
      .feedsViewModel
      .progress
      .subscribe(progress => this.setState({ refreshing: progress }))
    this.unsubscribeFromSyncError = this
      .feedsViewModel
      .syncError
      .subscribe(event =>
        Alert.alert(
          strings("error"),
          strings("errorSyncFeeds"),
          [{text:strings("ok")}]))
    this.feedsViewModel.onCreated()
  }

  componentWillUnmount() {
    this.feedsViewModel.onDestroyed()
    this.unsubscribeFromFeeds()
    this.unsubscribeFromProgress()
    this.unsubscribeFromSyncError()
  }

  render() {
    return (
      <View
        style={styles.container}>
        <OnlineStatusComponent
          onlineStatusViewModel={this.onlineStatusViewModel}/>
        <FlatList
          style={styles.list}
          data={this.state.feeds}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          refreshing={this.state.refreshing}
          onRefresh={() => this.feedsViewModel.onRefresh()}/>
      </View>
    )
  }

  _keyExtractor = (item, index) => `${item.id}`

  _renderItem = ({item}) =>
    <TouchableOpacity
      style={styles.item}
      onPress={() => this.feedsViewModel.onFeedPressed(item)}>
      <Text
        style={styles.text}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {item.title}
      </Text>
    </TouchableOpacity>

  _onAddFeedPressed = () => this.feedsViewModel.onAddFeedPressed()
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
    justifyContent: 'center',
    marginStart: 16,
    marginEnd: 16
  },
  text: {
    fontSize: 16
  },
  icon: {
    height: 36,
    width: 36,
    marginEnd: 8
  }
})
