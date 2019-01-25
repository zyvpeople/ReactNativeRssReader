import FeedLocalRepository from '../datasource/FeedLocalRepository';
import Database from '../datasource/Database';
import XmlFeedParser from '../datasource/XmlFeedParser';
import FetchHttpClient from '../datasource/httpClient/FetchHttpClient';
import NativeHttpClient from '../datasource/httpClient/NativeHttpClient';
import FeedRemoteRepository from '../datasource/FeedRemoteRepository';
import Logger from '../datasource/Logger';
import CompositeWriter from '../datasource/writer/CompositeWriter'
import ConsoleWriter from '../datasource/writer/ConsoleWriter'
import RedBoxWriter from '../datasource/writer/RedBoxWriter'
import YellowBoxWriter from '../datasource/writer/YellowBoxWriter'
import { FeedService } from '../domain/service/FeedService';
import NetworkService from '../domain/service/NetworkService';
import ViewModelFactory from '../presentation/ViewModelFactory';

export default class ServiceLocator {
  constructor() {
    const consoleWriter = new ConsoleWriter()
    const redBoxWriter = new RedBoxWriter()
    const yellowBoxWriter = new YellowBoxWriter()
    const debugWriter = new CompositeWriter([consoleWriter, yellowBoxWriter])
    const errorWriter = new CompositeWriter([consoleWriter, redBoxWriter])
    const logger = new Logger(debugWriter, errorWriter)
    this.networkService = new NetworkService(logger)
    const database = new Database(logger)
    const feedLocalRepository = new FeedLocalRepository(database, logger)
    const feedParser = new XmlFeedParser()
    const fetchHttpClient = new FetchHttpClient()
    const nativeHttpClient = new NativeHttpClient()
    const feedRemoteRepository = new FeedRemoteRepository(nativeHttpClient, feedParser)
    this.feedService = new FeedService(
      feedLocalRepository,
      feedRemoteRepository,
      this.networkService,
      logger)
    this.viewModelFactory = new ViewModelFactory(
      this.networkService,
      this.feedService)
  }
}
