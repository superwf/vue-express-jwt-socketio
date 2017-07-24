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
  </div>
</template>

<script>
import axios from 'axios'
// import gql from 'graphql-tag'
import usersGql from '../gql/users.gql'
import updateUserGql from '../gql/updateUser.gql'
import createUserGql from '../gql/createUser.gql'

export default {
  name: 'hello',
  data () {
    return {
      name: 'wf',
      password: 'sdf',
      token: '',
      newUserName: 'new Name xxx',
      userByToken: null,
      user: null,
      users: []
    }
  },
  apollo: {
    users: {
      query: usersGql
    }
  },
  methods: {
    submit () {
      axios.post('/login', {
        user: this.name,
        password: this.password
      }).then(data => {
        this.token = data.data.token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
        localStorage.setItem('token', `Bearer ${this.token}`)
        axios.defaults.headers.common.accept = 'applocation/json'
      })
    },
    testToken () {
      axios.get('/dashboard').then(data => {
        this.userByToken = data.data
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
      this.$apollo.mutate({
        mutation: createUserGql,
        variables: {
          user: {
            id: this.users[0].id,
            name: this.newUserName
          }
        }
      })
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
