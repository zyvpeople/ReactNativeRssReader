import {DOMParser} from 'xmldom'
import Feed from '../domain/entity/Feed'
import FeedItem from '../domain/entity/FeedItem'

export default class XmlFeedParser {

  constructor() {
    this._domParser = new DOMParser()
  }

  parseFeedAndFeedItems(feedUrl, data) {
    const document = this._domParser.parseFromString(data, 'application/xml')
    const channelElement = document.getElementsByTagName("channel")[0]
    const feed = this._parseFeed(feedUrl, channelElement)
    const feedItems = this._parseFeedItems(channelElement)
    return { feed, feedItems }
  }

  _parseFeed(feedUrl, channelElement) {
    const title = channelElement
      .getElementsByTagName("title")[0]
      .firstChild
      .nodeValue
    return new Feed(0, title, feedUrl)
  }

  _parseFeedItems(channelElement) {
    return Array
      .from(channelElement.getElementsByTagName("item"))
      .map(item => this._parseFeedItem(item))
  }

  _parseFeedItem(itemDocument) {
    return new FeedItem(
      0,
      itemDocument.getElementsByTagName("title")[0].firstChild.nodeValue,
      itemDocument.getElementsByTagName("description")[0].firstChild.nodeValue,
      new Date(itemDocument.getElementsByTagName("pubDate")[0].firstChild.nodeValue).getTime(),
      itemDocument.getElementsByTagName("link")[0].firstChild.nodeValue,
      itemDocument.getElementsByTagName("media:thumbnail")[0].getAttribute("url"),
      0)
  }
}
