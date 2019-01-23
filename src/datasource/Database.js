import BehaviourSubject from '../domain/common/BehaviourSubject'
import SQLite from 'react-native-sqlite-storage'

export default class Database {
  constructor(logger) {
    this._dbSubject = new BehaviourSubject(null)
    this._db = SQLite.openDatabase(
      "rssReader.db",
      "1.0",
      "RssReader",
      200000,
      () => this._db.transaction(
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
          error => {
            logger.e(error, 'Error create db')
            this._dbSubject.onNext({ failure: error })
          },
          () => {
            logger.d('Db created')
            this._dbSubject.onNext({ success: this._db })
          }
        ),
      error => {
        logger.e(error, 'Error open db')
        this._dbSubject.onNext({ failure: error })
      }
    )
  }

  get() {
    var unsubscribe = null
    return new Promise((resolve, reject) => {
      unsubscribe = this._dbSubject.subscribe(value => {
        if (value === null) {
          return
        } else if (value.success !== null) {
          resolve(value.success)
        } else {
          reject(value.failure)
        }
      })
    }).then(db => {
      unsubscribe()
      return db
    })
  }
}
