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
import updateUserGql from '../gql/updateUser.gql'
// import subscribeUser from '../gql/subscribeUser.gql'
// import { wsClient } from '../apollo'
import { mapState, mapActions } from 'vuex'
import { ME, ADD_USER, USERS } from 'store/types'

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
      loadingUsers: 0,
      skip: true,
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.user.me
      },
      users (state) {
        return state.user.users
      }
    })
  },
  beforeMount () {
    this.fetchUsers()
  },
  methods: {
    ...mapActions({
      fetchUsers: USERS
    }),
    submit () {
      axios.post('/login', {
        name: this.name,
        password: this.password
      }).then(data => {
        this.token = data.data.token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
        localStorage.setItem('token', this.token)
      })
    },
    testToken () {
      axios.get('/dashboard').then(data => {
        this.userByToken = data.result
      })
    },

    updateUser () {
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
      this.$store.dispatch('query', {
        query: `mutation createUser($user: UserInput) {
          createUser(user: $user) { id name password }
        }`,
        variables: {
          user: {
            name: this.newUserName,
            password: 'sdfasfsa'
          }
        },
        type: ADD_USER,
        operationName: 'createUser'
      })
    },
    sendByAxios () {
      this.$store.dispatch(ME)
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
