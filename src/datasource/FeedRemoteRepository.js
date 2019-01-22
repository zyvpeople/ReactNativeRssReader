import { Observable } from '../domain/common/Observable'

export default class FeedRemoteRepository {

  constructor(feedParser) {
    this.feedParser = feedParser
  }

  async feedAndFeedItems(feedUrl) {
    let headers = new Headers()
    headers.append('Content-Type', 'application/xml')
    return fetch(
      feedUrl,
      {
        method: 'GET',
        headers: headers
      })
      .then(response => response.text())
      .then(data => this.feedParser.parseFeedAndFeedItems(feedUrl, data))
  }
}
