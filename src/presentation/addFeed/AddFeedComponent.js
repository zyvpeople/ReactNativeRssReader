import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert, TextInput, Button, ActivityIndicator} from 'react-native'

export default class AddFeedComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add feed',
      headerRight: (
        <Button
          title='Create'
          disabled={navigation.getParam('progress')}
          onPress={ () => navigation.getParam('onCreatePressed')()}/>
      )
    }
  }

  constructor(props) {
    super(props)
    this.addFeedViewModel = this.props.addFeedViewModel
    this.state = {
      progress: false,
      feedUrl: ""
    }
    this.props.navigation.setParams({progress: false})
  }

  componentDidMount() {
    this.props.navigation.setParams({ onCreatePressed: this._onCreatePressed });
    this.unsubscribeFromProgress = this
      .addFeedViewModel
      .progress
      .subscribe(progress => {
        this.setState({progress:progress})
        this.props.navigation.setParams({progress: progress})
      })
    this.unsubscribeFromCreateFeedError = this
      .addFeedViewModel
      .createFeedError
      .subscribe(event =>
        Alert.alert(
          'Error',
          'Error create feed',
          [{text:'Ok'}]))
    this.addFeedViewModel.onCreated()
  }

  componentWillUnmount() {
    this.addFeedViewModel.onDestroyed()
    this.unsubscribeFromProgress()
    this.unsubscribeFromCreateFeedError()
  }

  render() {
    let progress = this.state.progress
      ? (
        <View style={styles.loading}>
            <ActivityIndicator/>
        </View>
      )
      : null
    return (
      <View
        style={styles.container}
        pointerEvents={this.state.progress ? 'none' : 'auto'}>
        <Text>Feed URL</Text>
        <TextInput
          placeholder="Enter feed URL"
          value={this.state.feedUrl}
          onChangeText={text => this.setState({feedUrl: text})}
          />
        {progress}
      </View>
    )
  }

  _onCreatePressed = () => this.addFeedViewModel.onCreatePressed(this, this.state.feedUrl)
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
