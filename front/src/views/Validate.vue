<template>
  <div class="container">
    <template v-if="!display_pass">
      <h1 class="mt-4 text-center">Databases</h1>
      <table class="table mt-5" align="center">
        <thead>
          <tr>
            <th scope="col">Base</th>
            <th scope="col">Rights</th>
            <th scope="col">Host</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ name }}</td>
            <td>{{ right }}</td>
            <td>{{ dbpath }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <input v-model="time" type="range" min="30" max="180" value="30" o />
        <label for="time">Time before access will be revoked ({{ time }} minutes )</label>
      </div>
      <div>
       <button v-on:click="validate(id)">Go</button>
      </div>
    </template>


    <template v-else>
      <h1 class="mt-4 text-center">Activation</h1>
      <div>
        <div>{{ name }} - {{ right }}@ {{ dbpath }} for {{ time }} min</div>
        <div>
          <p class="credential">Username : {{ username }}</p>
          <p class="credential">Password: {{ password }}</p>
        </div>
        <div></div>
        <div>
          <p class="alert">{{ error }}</p>
        </div>
      </div>
    </template>
  <div></div>   
  <div>
    <router-link :to="{ path: '/' }">Back</router-link>
  </div>
</template>

<script>
import { get_password } from "../modules/get_password.js";

export default {
  name: "Validate",
  data: function () {
    return {
      time: 30,
      name: this.$route.query.name,
      right: this.$route.query.right,
      dbpath: this.$route.query.dbpath,
      id: this.$route.params.id,
      username: "",
      password: "",
      error: "",
      display_pass: false,
    };
  },
  created() {},
  methods: {
    validate(i) {
      get_password(i, this.time).then((result) => {
        if (result) {
          if (result.data.error) this.error = result.data.errorstr;
          else {
            this.password = result.data.credentials["db_user_password"];
            this.username = result.data.credentials["db_user_name"];
          }
          this.display_pass = true;
        }
      });
    },
  },
};
</script>



<style>
.alert {
  color: red;
}

.credential {
  color: green;
}
</style>