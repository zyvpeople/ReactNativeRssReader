export default class FeedItem {
  constructor(id, title, summary, dateTime, url, imageUrl, feedId) {
    this.id = id
    this.title = title
    this.summary = summary
    this.dateTime = dateTime
    this.url = url
    this.imageUrl = imageUrl
    this.feedId = feedId
  }
}
