import Vue from 'vue'
import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const networkInterface = createBatchingNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  batchInterval: 100,
  // transportBatching: true,
})

const wsClient = new SubscriptionClient('ws://localhost:5000/subscriptions', {
  reconnect: true
})
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

networkInterface.use([{
  applyBatchMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem('token')
    if (token) {
      req.options.headers.authorization = token
      next()
    } else {
      alert('no auth')
    }
  },
}]).useAfter([{
  applyBatchAfterware ({ response }, next) {
    // if (response.status === 401) {
    //   logout()
    // }
    next()
  }
}])

const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  shouldBatch: true,
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo, {
  apolloClient
})

export default apolloProvider
