<template>
  <div class="container">
    <template v-if="!edit">
      <h1 class="mt-4 text-center">Databases</h1>
      <div>&nbsp;</div>
      <button @click="addDatabase">Add Database</button>
      <div>&nbsp;</div>
      <table class="table mt-5" align="center">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">path</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in database" :key="i">
            <td>{{ entry.id }}</td>
            <td>{{ entry.db_name }}</td>
            <td>{{ entry.db_path }}</td>
            <td>
              <a href="#" @click="editDatabase(entry.id,entry.db_name, entry.db_path)">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div>&nbsp;</div>
      <router-link :to="{ path: '/admin' }">Back</router-link>
    </template>
    <template v-else>
      <h1 class="mt-4 text-center">Edit user</h1>
       <p><a href="javascript:;" v-on:click="delete_db" v-if="dbId!=null">Delete</a></p>
  <form
    id="app"
  >

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="(error,item) in errors" :key="item">{{ error }}</li>
    </ul>
  </p>
  
  <p>
    <label for="email">DB Name</label>
    <input
      id="name"
      v-model="dbName"
      type="text"
      name="dbname"
    >
  </p>
  <p>
    <label for="email">DB Path</label>
    <input
      id="path"
      v-model="dbPath"
      type="text"
      name="dbpath"
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
import { get_all_db, updateDatabase, delete_db } from "../modules/admin.js";

export default {
  name: "Admin Database",
  data: () => ({
    database: [],
    isAdmin: false,
    edit: false,
    errors: [],
    dbName: null,
    dbPath: null,
    dbId: null,
  }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.load_database();
  },
  methods: {
    delete_db() {
      if (confirm("Do you really want to delete?")) {
        delete_db(this.dbId).then(() => {
          this.load_database();
          this.edit = false;
        });
      }
    },
    load_database() {
      get_all_db().then((res) => {
        this.database = res;
      });
    },
    addDatabase() {
      this.dbId = null;
      this.dbPath = null;
      this.dbName = null;
      this.edit = true;
    },
    editDatabase(id, name, path) {
      this.dbId = id;
      this.edit = true;
      this.dbName = name;
      this.dbPath = path;
    },
    checkForm() {
      this.error = [];
      if (this.dbPath == null) this.error.push("Path could not be empty");
      if (this.dbName == null) this.error.push("Name could not be empty");
      if (this.error.length === 0)
        updateDatabase(this.dbId, this.dbName, this.dbPath).then(() => {
          this.load_database();
          this.edit = false;
        });
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