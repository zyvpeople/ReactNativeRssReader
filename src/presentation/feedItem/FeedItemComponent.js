import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert, TouchableOpacity, Share, ScrollView, Image} from 'react-native'

export default class FeedItemComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feed item',
      headerRight: (
        <View
          style={styles.rightHeaderContainer}>
          <TouchableOpacity
            onPress={ () => navigation.getParam('onOpenInBrowserPressed')()}>
            <Image
              style={styles.icon}
              source={require('../resources/images/browser.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ () => navigation.getParam('onSharePressed')()}>
            <Image
              style={styles.icon}
              source={require('../resources/images/share.png')}/>
          </TouchableOpacity>
        </View>
      )
    }
  }

  constructor(props) {
    super(props)
    this.feedItemViewModel = this.props.navigation.getParam("feedItemViewModel")
    this.state = { feedItem: null }
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
        <Text
          style={styles.title}>
          {this.state.feedItem.title}
        </Text>
        <Text
          style={styles.date}>
          {new Date(this.state.feedItem.dateTime).toLocaleString()}
        </Text>
        <Text
          style={styles.summary}>
          {this.state.feedItem.summary}
        </Text>
      </ScrollView>
    )
  }

  _onOpenInBrowserPressed = () => this.feedItemViewModel.onOpenInBrowserPressed()

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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  },
  date: {
    fontSize: 16,
    margin: 16,
    marginTop: 0
  },
  summary: {
    fontSize: 16,
    margin: 16,
    marginTop: 0
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 8
  }
})
