import { FeedLocalRepository } from '../datasource/FeedLocalRepository';
import XmlFeedParser from '../datasource/XmlFeedParser';
import FeedRemoteRepository from '../datasource/FeedRemoteRepository';
import Logger from '../datasource/Logger';
import { FeedService } from '../domain/service/FeedService';
import NetworkService from '../domain/service/NetworkService';
import ViewModelFactory from '../presentation/ViewModelFactory';

export default class ServiceLocator {
  constructor() {
    this.logger = new Logger()
    this.networkService = new NetworkService()
    this.feedLocalRepository = new FeedLocalRepository()
    this.feedRemoteRepository = new FeedRemoteRepository(new XmlFeedParser())
    this.feedService = new FeedService(
      this.feedLocalRepository,
      this.feedRemoteRepository,
      this.networkService,
      this.logger)
    this.viewModelFactory = new ViewModelFactory(
      this.networkService,
      this.feedService)
  }
}
