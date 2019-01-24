import React, {Component} from 'react'
import {StyleSheet, FlatList, View, Text, TouchableOpacity, Alert, Button} from 'react-native'
import OnlineStatusComponent from '../onlineStatus/OnlineStatusComponent'

export default class FeedsComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feeds',
      headerRight: (
        <Button
          title="Add"
          onPress={ () => navigation.getParam('onAddFeedPressed')()}/>
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
          'Error',
          'Error sync feeds',
          [{text:'Ok'}]))
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
      onPress={() => this.feedsViewModel.onFeedPressed(this, item)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>

  _onAddFeedPressed = () => this.feedsViewModel.onAddFeedPressed(this)
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  item: {
    height: 48
  }
})
