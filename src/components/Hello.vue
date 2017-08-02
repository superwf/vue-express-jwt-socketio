<template>
  <div class="hello">
    <form @submit.prevent="submit">
      <input name="name" v-model="name" />
      <input name="password" v-model="password" />
      <button>login</button>
    </form>
    <center v-if="token">
      <button @click="testToken" v-if="token">get user from api by token</button>
    </center>
    <div v-if="userByToken">
      <h2>fetched data from api by token</h2>
      <p>token is {{ token }}</p>
      <p>userByToken: {{ userByToken.user }}</p>
    </div>
    <ul>
      <li v-for="u in users">{{ u.id }} : {{ u.name }}</li>
    </ul>

    <form @submit.prevent="updateUser">
      <input v-model="newUserName" />
      <button>update user1 name</button>
    </form>
    <form @submit.prevent="createUser">
      <input v-model="newUserName" />
      <button>create user</button>
    </form>
    <button @click="sendByAxios">SEND GRAPHQL BY axios</button>
  </div>
</template>

<script>
import axios from 'axios'
// import gql from 'graphql-tag'
// import usersGql from '../gql/users.gql'
import clientsGql from '../gql/clients.gql'
import updateUserGql from '../gql/updateUser.gql'
import createUserGql from '../gql/createUser.gql'
// import subscribeUser from '../gql/subscribeUser.gql'
// import { wsClient } from '../apollo'
import { mapState } from 'vuex'
import { ME } from 'store/types'

// console.log(usersGql)

export default {
  name: 'hello',
  data () {
    return {
      name: 'admin',
      password: 'admin',
      token: '',
      newUserName: 'new Name xxx',
      userByToken: null,
      user: null,
      users: [],
      loadingUsers: 0,
      skip: true,
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.user.me
      }
    })
  },
  // apollo: {
  //   users: {
  //     query: usersGql,
  //     // skip () {
  //     //   return this.skip
  //     // },
  //     // fetchPolicy: 'cache-and-network',
  //     // pollInterval: 1000,
  //     loadingKey: 'loadingUsers',
  //     error (error) {
  //       const { status } = error.networkError.response
  //       if (status === 401) {
  //         console.log(wsClient.reconnect)
  //         // wsClient.close(true, true)
  //       }
  //     },
  //     result () {
  //       console.log(wsClient)
  //     },
  //     subscribeToMore: {
  //       document: subscribeUser,
  //       updateQuery: (previousResult, { subscriptionData }) => {
  //         // console.log(previousResult)
  //         const user = subscriptionData.data.userAdded
  //         // console.log(222, user)
  //         return {
  //           ...previousResult,
  //           users: [...previousResult.users, user],
  //         }
  //         // previousResult.users.push(user)
  //         // this.users = [...this.users, user]
  //         // this.users.push(user)
  //       }
  //     }
  //   },
  // },
  mounted () {
    // setTimeout(() => {
    //   this.skip = false
    // }, 1000)
    // const observer = this.$apollo.subscribe({
    //   query: subscribeUser
    // })
    // const self = this
    // observer.subscribe({
    //   next (data) {
    //     console.log(111, data)
    //     self.users.push(data.userAdded)
    //   },
    //   error (e) {
    //     console.error(e)
    //   }
    // })
  },
  methods: {
    submit () {
      axios.post('/login', {
        name: this.name,
        password: this.password
      }).then(data => {
        this.token = data.data.token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common.accept = 'applocation/json'
        // wsClient.connectionParams.token = this.token
        // wsClient.tryReconnect()
        // this.$apollo.queries.users.subscribeToMore({
        //   document: subscribeUser,
        //   updateQuery: (previousResult, { subscriptionData }) => {
        //     console.log(previousResult, subscriptionData)
        //     const user = subscriptionData.data.userAdded
        //     return {
        //       ...previousResult,
        //       users: [...previousResult.users, user],
        //     }
        //   }
        // })
      })
    },
    testToken () {
      axios.get('/dashboard').then(data => {
        this.userByToken = data.data
      })
    },

    updateUser () {
      // console.log(this.$apollo)
      this.$apollo.query({
        query: clientsGql
      }).then(console.log)
      this.$apollo.mutate({
        mutation: updateUserGql,
        variables: {
          user: {
            id: this.users[0].id,
            name: this.newUserName
          }
        }
      })
    },
    createUser () {
      console.log(createUserGql)
      this.$apollo.mutate({
        mutation: createUserGql,
        variables: {
          user: {
            name: this.newUserName,
            password: ''
          }
        }
      })
    },
    sendByAxios () {
      this.$store.dispatch(ME)
      // console.log(usersGql)
      // axios.post('/grqphql', {
      // })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
