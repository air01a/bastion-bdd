<template>
  <div class="container">
    <template v-if="!edit">
      <h1 class="mt-4 text-center">Databases Users</h1>
      <div>&nbsp;</div>
      <button @click="addUser">Add User</button>
      <div>&nbsp;</div>
      <table class="table mt-5" align="center">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Database</th>
            <th scope="col">Role</th>

            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in users" :key="i">
            <td>{{ entry.id }}</td>
            <td>{{ entry.db_user_name }}</td>
            <td>{{ entry.db_name}}</td>
            <td>{{ entry.db_user_role}}</td>
            <td>
              <a href="#" @click="editUser(entry.id,entry.db_user_name, entry.db_id, entry.db_user_role)">Edit</a>
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
  <a href="javascript:;" v-on:click="delete_user" v-if="id!=null">Delete</a>
  <p>
    <label for="name">User Name</label>
    <input
      id="name"
      v-model="db_user_name"
      type="text"
      name="name"
    >
  </p>
 <p>
    <label for="database">DataBase</label>
    <listDB v-model="db_id" :selectedDB="db_id"/>
  </p>

    <p>
    <label for="password">Password</label>
    <input
      id="password"
      v-model="password"
      type="password"
      name="password"
    >
  </p>
  <p>
  <label for="role">Role</label>
    <select v-model="db_user_role">
      <option  value='' disabled>Sélectionnez le rôle</option>
      <option  value='RO'>RO</option>
      <option value='RW'>RW</option>
    </select>
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
import {
  get_all_db_users,
  update_db_user,
  delete_db_user,
} from "../modules/admin.js";

export default {
  name: "Admin DB Users",
  data: () => ({
    users: [],
    isAdmin: false,
    edit: false,
    errors: [],
    db_user_name: null,
    db_user_password: null,
    db_user_role: null,
    db_id: null,
    id: null,
  }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.load_user();
  },
  methods: {
    delete_user() {
      if (confirm("Do you really want to delete?")) {
        delete_db_user(this.id).then(() => {
          this.load_user();
          this.edit = false;
        });
      }
    },
    load_user() {
      get_all_db_users().then((res) => {
        this.users = res;
      });
    },
    addUser() {
      this.id = null;
      this.db_user_name = null;
      this.db_user_role = null;
      this.edit = true;
      this.db_user_password = null;
      this.db_id = null;
    },
    editUser(id, name, db, role) {
      this.id = id;
      this.edit = true;
      this.db_user_name = name;
      this.db_id = db.toString();
      this.db_user_role = role;
      this.password = null;
      console.log("id", this.db_id);
    },
    checkForm() {
      this.error = [];
      if (
        this.db_user_name &&
        this.db_user_role &&
        (this.id != null || this.password != null)
      ) {
        update_db_user(
          this.id,
          this.db_user_name,
          this.db_id,
          this.db_user_role,
          this.password
        ).then(() => {
          this.load_user();
          this.edit = false;
        });
      } else {
        this.errors.push("Missing required parameters");
      }
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