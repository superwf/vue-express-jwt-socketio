import { PubSub, SubscriptionManager } from 'graphql-subscriptions'
import schema from './schema'

export const pubsub = new PubSub()
export const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  // setupFunctions: {
  //   tagAdded: (options, args) => ({
  //     tagAdded: {
  //       filter: tag => tag
  //     }
  //   })
  // }
})
