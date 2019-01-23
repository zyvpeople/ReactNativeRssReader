import Observable from '../domain/common/Observable'
import Feed from '../domain/entity/Feed'
import FeedItem from '../domain/entity/FeedItem'
import SQLite from 'react-native-sqlite-storage'

export default class FeedLocalRepository {
  constructor(database, logger) {
    this.database = database
    this.feedsChangedObservable = new Observable()
    this.feedItemsChangedObservable = new Observable()
    this.db = SQLite.openDatabase(
      "rssReader.db",
      "1.0",
      "RssReader",
      200000,
      () => this.db.transaction(
          tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS Feeds (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              url TEXT NOT NULL UNIQUE)`)
            tx.executeSql(`CREATE TABLE IF NOT EXISTS FeedItems (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              summary TEXT NOT NULL,
              dateTime INTEGER,
              url TEXT NOT NULL,
              imageUrl TEXT NOT NULL,
              feedId INTEGER,
              UNIQUE (url, feedId),
              CONSTRAINT fk_feeds
                FOREIGN KEY (feedId)
                REFERENCES Feeds(id)
                ON DELETE CASCADE)`)
          },
          error => logger.e(error, 'Error create db'),
          () => logger.d('Db created')
        ),
      error => logger.e(error, 'Error open db')
    )
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
          error => reject(error),
          () => {
            this.feedsChangedObservable.onNext(null)
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
        new Promise((resolve, reject) => this.db.transaction(
          tx => tx.executeSql('DELETE FROM Feeds WHERE id = ?', [feedId]),
          error => reject(error),
          () => {
            this.feedsChangedObservable.onNext(null)
            resolve(null)
          }))
      )
  }

  async feeds() {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => {
          this.db.transaction(
            tx => tx.executeSql(
              'SELECT id, title, url FROM Feeds ORDER BY title ASC',
              [],
              (tx, results) => {
                try {
                  resolve(results
                    .rows
                    .raw()
                    .map(row => new Feed(row.id, row.title, row.url)))
                } catch (error) {
                  reject(error)
                }
            }),
            error => reject(error))
        })
      )
  }

  async findFeed(feedId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => {
          this.db.transaction(
            tx => {
              tx.executeSql(
                'SELECT id, title, url FROM Feeds WHERE id = ? LIMIT 1',
                [feedId],
                (tx, results) => {
                  try {
                    if (results.rows.length == 1) {
                      let row = results.rows.item(0)
                      resolve(new Feed(row.id, row.title, row.url))
                    } else {
                      resolve(null)
                    }
                  } catch (error) {
                    reject(error)
                  }
              })
            },
            error => reject(error))
        })
      )
  }

  async createOrUpdateFeedItems(feedItems) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => this.db.transaction(
          tx => {
            feedItems.forEach(feedItem =>
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
            )
          },
          error => reject(error),
          () => {
            this.feedItemsChangedObservable.onNext(null)
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
        new Promise((resolve, reject) => {
          this.db.transaction(
            tx => {
              tx.executeSql(
                `SELECT id, title, summary, dateTime, url, imageUrl, feedId
                  FROM FeedItems
                  WHERE feedId = ?
                  ORDER BY dateTime DESC`,
                [feedId],
                (tx, results) => {
                  try {
                    resolve(results
                      .rows
                      .raw()
                      .map(row => new FeedItem(
                        row.id,
                        row.title,
                        row.summary,
                        row.dateTime,
                        row.url,
                        row.imageUrl,
                        row.feedId)))
                  } catch (error) {
                    reject(error)
                  }
              })
            },
            error => reject(error)
          )
        })
      )
  }

  async findFeedItem(feedItemId) {
    return this
      .database
      .get()
      .then(db =>
        new Promise((resolve, reject) => {
          this.db.transaction(
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
                      resolve(new FeedItem(
                        row.id,
                        row.title,
                        row.summary,
                        row.dateTime,
                        row.url,
                        row.imageUrl,
                        row.feedId))
                    } else {
                      resolve(null)
                    }
                  } catch (error) {
                    reject(error)
                  }
              })
            },
            error => reject(error)
          )
        })
      )
  }
}
