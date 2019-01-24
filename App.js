import ServiceLocator from './src/application/ServiceLocator'
import Router from './src/presentation/router/Router'

const serviceLocator = new ServiceLocator()
const viewModelFactory = serviceLocator.viewModelFactory
const router = new Router(viewModelFactory)

export default router.component()

//TODO: localize
//TODO: create NativeFeedRemoteRepository
