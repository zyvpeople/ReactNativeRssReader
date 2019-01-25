export default class FeedRemoteRepository {

  constructor(httpClient, feedParser) {
    this.httpClient = httpClient
    this.feedParser = feedParser
  }

  async feedAndFeedItems(feedUrl) {
    let headers = new Map()
    headers.set('Content-Type',  'application/xml')
    return this
      .httpClient
      .get(feedUrl, headers)
      .then(data => this.feedParser.parseFeedAndFeedItems(feedUrl, data))
  }
}
