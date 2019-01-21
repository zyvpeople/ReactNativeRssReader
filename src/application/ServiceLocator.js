import { FeedLocalRepository } from '../datasource/FeedLocalRepository';
import { FeedRemoteRepository } from '../datasource/FeedRemoteRepository';
import Logger from '../datasource/Logger';
import { FeedService } from '../domain/service/FeedService';
import { ImageService } from '../domain/service/ImageService';
import NetworkService from '../domain/service/NetworkService';

export class ServiceLocator {
  constructor() {
    this.logger = new Logger()
    this.networkService = new NetworkService()
    this.imageService = new ImageService()
    this.feedLocalRepository = new FeedLocalRepository()
    this.feedRemoteRepository = new FeedRemoteRepository()
    this.feedService = new FeedService(
      this.feedLocalRepository,
      this.feedRemoteRepository,
      this.networkService,
      this.logger)
  }
}
