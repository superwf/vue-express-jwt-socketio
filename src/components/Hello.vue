<template>
  <div class="hello">
    <form @submit="submit">
      <input name="name" v-model="name" />
      <input name="password" v-model="password" />
      <button>login</button>
    </form>
    <center v-if="token">
      <button @click="testToken" v-if="token">get user from api by token</button>
    </center>
    <div v-if="user">
      <h2>fetched data from api by token</h2>
      <p>token is {{ token }}</p>
      <p>user data {{ user }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'hello',
  data () {
    return {
      name: 'wf',
      password: 'sdf',
      token: '',
      user: null
    }
  },
  methods: {
    submit ($event) {
      $event.preventDefault()
      axios.post('/login', {
        user: this.name,
        password: this.password
      }).then(data => {
        this.token = data.data.token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
      })
    },
    testToken () {
      axios.get('/dashboard').then(data => {
        this.user = data.data
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
