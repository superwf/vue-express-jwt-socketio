<template>
  <div class="hello">
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
import { mapState, mapActions, mapGetters } from 'vuex'
import { CREATE_USER, USERS, UPDATE_USER } from 'store/types'

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
      users (state) {
        return state.user.users
      }
    }),
    ...mapGetters(['socket'])
  },
  beforeMount () {
    this.socket.emit('join', 'user')
    // this.socket.join('user')
    this.fetchUsers()
  },
  beforeDestroy () {
    // this.socket.leave('user')
  },
  methods: {
    ...mapActions({
      fetchUsers: USERS,
    }),
    createUser () {
      this.$store.dispatch(CREATE_USER, {
        name: this.newUserName,
        password: 'sdfasfsa'
      })
    },
    updateUser () {
      this.$store.dispatch(UPDATE_USER, {
        id: 1,
        name: this.newUserName,
        password: 'admin'
      })
    },
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
