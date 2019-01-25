import PublishSubject from '../domain/common/PublishSubject'
import Feed from '../domain/entity/Feed'
import FeedItem from '../domain/entity/FeedItem'
import SQLite from 'react-native-sqlite-storage'

export default class FeedLocalRepository {
  constructor(database, logger) {
    this.database = database
    this.logger = logger
    this.tag = "FeedLocalRepository"
    this.feedsChanged = new PublishSubject()
    this.feedItemsChanged = new PublishSubject()
  }

  async createOrUpdateFeed(feed) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => db.transaction(
          tx => tx.executeSql(`INSERT OR REPLACE INTO Feeds (title,url)
                                VALUES (?, ?)`,
                                [feed.title, feed.url]),
          error => {
            this.logger.e(this.tag, "Error createOrUpdateFeed", error)
            reject(error)
          },
          () => {
            this.logger.d(this.tag, "Success createOrUpdateFeed")
            this.feedsChanged.onNext(null)
            resolve(null)
          })
        )
      )
  }

  async removeFeed(feedId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => db.transaction(
          tx => tx.executeSql('DELETE FROM Feeds WHERE id = ?', [feedId]),
          error => {
            this.logger.e(this.tag, "Error removeFeed", error)
            reject(error)
          },
          () => {
            this.logger.d(this.tag, "Success removeFeed")
            this.feedsChanged.onNext(null)
            resolve(null)
          }))
      )
  }

  async feeds() {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) =>
          db.transaction(
            tx => tx.executeSql(
              'SELECT id, title, url FROM Feeds ORDER BY title ASC',
              [],
              (tx, results) => {
                try {
                  const result = results
                    .rows
                    .raw()
                    .map(row => new Feed(row.id, row.title, row.url))
                  this.logger.d(this.tag, "Success load feeds")
                  resolve(result)
                } catch (error) {
                  this.logger.e(this.tag, "Error parse feeds", error)
                  reject(error)
                }
            }),
            error => {
              this.logger.e(this.tag, "Error load feeds", error)
              reject(error)
            })
        )
      )
  }

  async findFeed(feedId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) =>
          db.transaction(
            tx => {
              tx.executeSql(
                'SELECT id, title, url FROM Feeds WHERE id = ? LIMIT 1',
                [feedId],
                (tx, results) => {
                  try {
                    if (results.rows.length == 1) {
                      let row = results.rows.item(0)
                      let result = new Feed(row.id, row.title, row.url)
                      this.logger.d(this.tag, "Success findFeed")
                      resolve(result)
                    } else {
                      this.logger.d(this.tag, "Success findFeed but feed is not found")
                      resolve(null)
                    }
                  } catch (error) {
                    this.logger.e(this.tag, "Error parse feed", error)
                    reject(error)
                  }
              })
            },
            error => {
              this.logger.e(this.tag, "Error findFeed", error)
              reject(error)
            })
        )
      )
  }

  async createOrUpdateFeedItems(feedItems) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => db.transaction(
          tx => feedItems.forEach(feedItem =>
            tx.executeSql(`INSERT OR REPLACE INTO FeedItems (
                            title, summary, dateTime, url, imageUrl, feedId)
                            VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                              feedItem.title,
                              feedItem.summary,
                              feedItem.dateTime,
                              feedItem.url,
                              feedItem.imageUrl,
                              feedItem.feedId])
            ),
          error => {
            this.logger.e(this.tag, "Error createOrUpdateFeedItems", error)
            reject(error)
          },
          () => {
            this.logger.d(this.tag, "Success createOrUpdateFeedItems")
            this.feedItemsChanged.onNext(null)
            resolve(null)
          })
        )
      )
  }

  async feedItems(feedId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) =>
          db.transaction(
            tx => {
              tx.executeSql(
                `SELECT id, title, summary, dateTime, url, imageUrl, feedId
                  FROM FeedItems
                  WHERE feedId = ?
                  ORDER BY dateTime DESC`,
                [feedId],
                (tx, results) => {
                  try {
                    const result = results
                      .rows
                      .raw()
                      .map(row => new FeedItem(
                        row.id,
                        row.title,
                        row.summary,
                        row.dateTime,
                        row.url,
                        row.imageUrl,
                        row.feedId))
                    this.logger.d(this.tag, "Success load feedItems")
                    resolve(result)
                  } catch (error) {
                    this.logger.e(this.tag, "Error parse feedItems", error)
                    reject(error)
                  }
              })
            },
            error => {
              this.logger.e(this.tag, "Error load feedItems", error)
              reject(error)
            }
          )
        )
      )
  }

  async findFeedItem(feedItemId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) =>
          db.transaction(
            tx => {
              tx.executeSql(
                `SELECT id, title, summary, dateTime, url, imageUrl, feedId
                  FROM FeedItems
                  WHERE id = ?
                  LIMIT 1`,
                [feedItemId],
                (tx, results) => {
                  try {
                    if (results.rows.length == 1) {
                      let row = results.rows.item(0)
                      const result = new FeedItem(
                        row.id,
                        row.title,
                        row.summary,
                        row.dateTime,
                        row.url,
                        row.imageUrl,
                        row.feedId)
                      this.logger.d(this.tag, "Success findFeedItem")
                      resolve(result)
                    } else {
                      this.logger.d(this.tag, "Success findFeedItem but feedItem is not found")
                      resolve(null)
                    }
                  } catch (error) {
                    this.logger.e(this.tag, "Error parse feedItem", error)
                    reject(error)
                  }
              })
            },
            error => {
              this.logger.e(this.tag, "Error findFeedItem", error)
              reject(error)
            }
          )
        )
      )
  }
}
