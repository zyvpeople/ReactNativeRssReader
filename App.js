import ServiceLocator from './src/application/ServiceLocator'
import Router from './src/presentation/router/Router'

const serviceLocator = new ServiceLocator()
const viewModelFactory = serviceLocator.viewModelFactory
const router = new Router(viewModelFactory)
const navigator = router.createNavigator()

export default navigator
