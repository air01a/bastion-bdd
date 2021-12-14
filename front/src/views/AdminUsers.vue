<template>
  <div class="container">
    <template v-if="!edit">
      <h1 class="mt-4 text-center">Databases</h1>
      <div>&nbsp;</div>
      <button @click="addUser">Add User</button>
      <div>&nbsp;</div>
      <table class="table mt-5" align="center">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in users" :key="i">
            <td>{{ entry.user_id }}</td>
            <td>{{ entry.user_mail }}</td>
            <td>
              <a href="#" @click="editUser(entry.user_id,entry.user_mail)">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div>&nbsp;</div>
      <router-link :to="{ path: '/admin' }">Back</router-link>
    </template>
    <template v-else>
      <h1 class="mt-4 text-center">Edit user</h1>
  <form
    id="app"
  >

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="(error,item) in errors" :key="item">{{ error }}</li>
    </ul>
  </p>
 <p><a href="javascript:;" v-on:click="delete_user" v-if="userId!=null">Delete</a></p>
  <p>
    <label for="email">User email</label>
    <input
      id="email"
      v-model="userEmail"
      type="text"
      name="email"
    >
  </p>

  <p>
    <input
      type="button"
      value="Submit"
        v-on:click="checkForm"
    >
  </p>
  

  </form>
  <div> &nbsp;</div>
        <a href="#" @click="edit=false">Back</a>

  </template>
  </div>

</template>

<script>
import store from "../store";
import { get_all_users, updateUser, delete_user } from "../modules/admin.js";

export default {
  name: "Admin Users",
  data: () => ({
    users: [],
    isAdmin: false,
    edit: false,
    errors: [],
    userId: null,
    userEmail: null,
  }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.load_user();
  },
  methods: {
    delete_user() {
      if (confirm("Do you really want to delete?")) {
        delete_user(this.userId).then(() => {
          this.load_user();
          this.edit = false;
        });
      }
    },
    load_user() {
      get_all_users().then((res) => {
        this.users = res;
      });
    },
    addUser() {
      this.userId = null;
      this.userEmail = null;
      this.edit = true;
    },
    editUser(id, email) {
      this.userId = id;
      this.edit = true;
      this.userEmail = email;
    },
    checkForm() {
      if (this.validateEmail()) {
        updateUser(this.userId, this.userEmail).then(() => {
          this.load_user();
          this.edit = false;
        });
      } else {
        this.errors.push("Email incorrect");
      }
    },
    validateEmail() {
      return String(this.userEmail)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}

table,
th,
td {
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 100px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

thead tr {
  background-color: #2966e0;
  color: #ffffff;
  text-align: center;
}
</style>