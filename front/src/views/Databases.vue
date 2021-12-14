<template>
  <div class="container">
    <h1 class="mt-4 text-center">Databases</h1>
    <table class="table mt-5" align="center">
      <thead>
        <tr>
          <th scope="col">Base</th>
          <th scope="col">Rights</th>
          <th scope="col">Activate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in databases" :key="i">
          <td>{{ entry.name }}</td>
          <td>{{ entry.right }}</td>
          <td>
            <router-link
              :to="{
                path: '/validate/' + entry.id,
                query: {
                  name: entry.name,
                  right: entry.right,
                  dbpath: entry.path,
                },
              }"
              >Go</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <h1 class="mt-4 text-center">Active connections</h1>
    <table class="table mt-5" align="center">
      <thead>
        <tr>
          <th scope="col">Base</th>
          <th scope="col">User</th>
          <th scope="col">Rights</th>
          <th scope="col">Remaining time</th>
          <th scope="col">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in active_connections" :key="i">
          <td>{{ entry.name }}</td>
          <td>{{ entry.user_name }}</td>
          <td>{{ entry.right }}</td>
          <td>{{ entry.duration }}</td>

          <td>
            <button v-on:click="delete_active_connection(entry.id)">
              Kill
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>&nbsp;</div>
    <div v-if="isAdmin">
      <router-link :to="{ path: '/admin' }">Administration</router-link>
    </div>
  </div>
</template>

<script>
import store from "../store/";
import { get_user_databases_rights } from "../modules/get_user_databases_rights.js";
import {
  get_user_active_connections,
  delete_user_active_connections,
} from "../modules/get_user_active_connections.js";

export default {
  name: "Databases",
  data: () => ({ databases: [], active_connections: [], isAdmin: false }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.get_user_database();
    this.get_active_connections();
  },
  methods: {
    delete_active_connection(id) {
      delete_user_active_connections(id).then(() => {
        this.get_active_connections();
      });
    },

    get_user_database() {
      get_user_databases_rights().then((databases) => {
        console.log(databases);
        if (databases) {
          for (let i = 0; i < databases.data.db.length; i++)
            this.databases.push({
              id: databases.data.db[i]["right_id"],
              name: databases.data.db[i]["db_name"],
              right: databases.data.db[i]["right_role"],
              path: databases.data.db[i]["db_path"],
            });
        }
      });
    },
    get_active_connections() {
      this.active_connections = [];
      get_user_active_connections().then((databases) => {
        console.log(databases);
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        if (databases) {
          for (let i = 0; i < databases.data.length; i++)
            this.active_connections.push({
              id: databases.data[i]["log_id"],
              duration:
                parseInt(databases.data[i]["log_duration"]) +
                parseInt(databases.data[i]["log_date"]) -
                timestamp,
              name: databases.data[i]["db_name"],
              user_name: databases.data[i]["db_user_name"],
              right: databases.data[i]["db_user_role"],
            });
        }
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