<template>
  <div class="container">
    <template v-if="!edit">
      <h1 class="mt-4 text-center">User Rights</h1>
      <div>&nbsp;</div>
      <button @click="addRight">Add Right</button>
      <div>&nbsp;</div>
      <table class="table mt-5" align="center">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">DB</th>
            <th scope="col">User</th>
            <th scope="col">Role</th>
            <th scope="col">Expiration</th>

            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in rights" :key="i">
            <td>{{ entry.right_id }}</td>
            <td>{{ entry.db_name }}</td>
            <td>{{ entry.user_mail}}</td>
            <td>{{ entry.right_role}}</td>
            <td>{{ entry.right_expire }}</td>
            
            <td>
              <a href="#" @click="editRight(entry.right_id,entry.right_user_id, entry.right_db_id, entry.right_role, entry.right_expire)">Edit</a>
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

     <p><a href="javascript:;" v-on:click="delete_right" v-if="id!=null">Delete</a></p>

 <p>
    <label for="database">DataBase </label>
    <listDB v-model="db_id" :selectedDB="db_id"/>
  </p>
   <p>
    <label for="Users">Users </label>
    <listUsers v-model="user_id" :selectedUser="user_id"/>
  </p>
<p>
    <label for="database">Role </label>
    <listRole v-model="role" :selectedRole="role"/>
  </p>
 
 <p>
    <label for="name">Expire (days, 0 = no limit) </label>
    <input
      id="expire"
      v-model="expiration"
      type="text"
      name="expire"
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
import {
  get_all_rights,
  update_right,
  delete_right,
} from "../modules/admin.js";

export default {
  name: "Admin Rights",
  data: () => ({
    rights: [],
    isAdmin: false,
    edit: false,
    errors: [],
    user_id: null,
    db_id: null,
    role: null,
    id: null,
    expiration: null,
  }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.load_rights();
  },
  methods: {
    delete_right() {
      if (confirm("Do you really want to delete?")) {
        delete_right(this.id).then(() => {
          this.load_rights();
          this.edit = false;
        });
      }
    },
    load_rights() {
      get_all_rights().then((res) => {
        this.rights = res;
      });
    },
    addRight() {
      this.id = null;
      this.db_user_name = null;
      this.role = null;
      this.edit = true;
      this.db_user_password = null;
      this.db_id = null;
      this.expiration = 0;
    },
    editRight(id, userid, dbid, role, expiration) {
      this.id = id;
      this.edit = true;
      this.db_id = parseInt(dbid);
      this.user_id = parseInt(userid);

      this.role = role;
      this.expiration = expiration;
    },
    checkForm() {
      this.error = [];
      if (this.expiration != null && this.role != null) {
        update_right(
          this.id,
          this.db_id,
          this.user_id,
          this.expiration,
          this.role
        ).then(() => {
          this.load_rights();
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