import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'

export default class AddFeedComponent extends Component {

  static navigationOptions = { title: 'Add feed' }

  constructor(props) {
    super(props)
    this.addFeedViewModel = this.props.addFeedViewModel
    this.state = {
      feedUrl: ""
    }
  }

  componentDidMount() {
    this.addFeedViewModel.onCreated()
  }

  componentWillUnmount() {
    this.addFeedViewModel.onDestroyed()
  }

  render() {
    return (
      <View
        style={styles.container}>
        <Text>Add feed</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
