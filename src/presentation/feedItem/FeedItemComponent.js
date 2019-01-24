import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert, Button, Share, ScrollView, Image} from 'react-native'

export default class FeedItemComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feed item',
      headerRight: (
        <View
          style={styles.rightHeaderContainer}>
          <Button
            title='Browser'
            onPress={() => navigation.getParam('onOpenInBrowserPressed')()}/>
          <Button
            title='Share'
            onPress={() => navigation.getParam('onSharePressed')()}/>
        </View>
      )
    }
  }

  constructor(props) {
    super(props)
    this.feedItemViewModel = this.props.feedItemViewModel
    this.state = {
      feedItem: null
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({onOpenInBrowserPressed: this._onOpenInBrowserPressed})
    this.props.navigation.setParams({onSharePressed: this._onSharePressed})
    this.unsubscribeFromFeedItem = this
      .feedItemViewModel
      .feedItem
      .subscribe(feedItem => this.setState({ feedItem: feedItem }))
    this.unsubscribeFromLoadFeedItemError = this
      .feedItemViewModel
      .loadFeedItemError
      .subscribe(event =>
        Alert.alert(
          'Error',
          'Error load feed item',
          [{text:'Ok'}]))
    this.unsubscribeFromShareUrl = this
      .feedItemViewModel
      .shareUrl
      .subscribe(url =>
        Share.share({
          message: url,
          url: url,
          title: 'Share URL'
        }))
    this.feedItemViewModel.onCreated()
  }

  componentWillUnmount() {
    this.feedItemViewModel.onDestroyed()
    this.unsubscribeFromFeedItem()
    this.unsubscribeFromLoadFeedItemError()
  }

  render() {
    if (this.state.feedItem === null) {
      return null
    }
    return (
      <ScrollView
        style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: this.state.feedItem.imageUrl}}/>
        <Text>{this.state.feedItem.title}</Text>
        <Text>{new Date(this.state.feedItem.dateTime).toLocaleString()}</Text>
        <Text>{this.state.feedItem.summary}</Text>
      </ScrollView>
    )
  }

  _onOpenInBrowserPressed = () => this.feedItemViewModel.onOpenInBrowserPressed(this)

  _onSharePressed = () => this.feedItemViewModel.onSharePressed()
}

const styles = StyleSheet.create({
  rightHeaderContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    flex: 1
  },
  image: {
    height: 200
  }
})
