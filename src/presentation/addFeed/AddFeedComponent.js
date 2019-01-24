import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import {strings} from '../resources/locales/i18n'

export default class AddFeedComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: strings('addFeed'),
      headerRight: (
        <TouchableOpacity
          disabled={navigation.getParam('progress')}
          onPress={ () => navigation.getParam('onCreatePressed')()}>
          <Image
            style={styles.icon}
            source={require('../resources/images/done.png')}/>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.addFeedViewModel = this.props.navigation.getParam("addFeedViewModel")
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
          strings('error'),
          strings('errorCreateFeed'),
          [{text:strings('ok')}]))
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
        <Text
          style={styles.title}>
          {strings('feedUrl')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={strings('enterFeedUrl')}
          value={this.state.feedUrl}
          onChangeText={text => this.setState({feedUrl: text})}/>
        {progress}
      </View>
    )
  }

  _onCreatePressed = () => this.addFeedViewModel.onCreatePressed(this.state.feedUrl)
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 16,
    margin: 16,
    marginBottom: 8
  },
  input: {
    fontSize: 16,
    margin: 16,
    marginTop: 0
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
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 8
  }
})
