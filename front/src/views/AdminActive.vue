<template>
  <div class="container">
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
    <router-link :to="{ path: '/admin' }">Back</router-link>
  </div>
</template>

<script>
import store from "../store";
import {
  get_all_active_rights,
  delete_active_connections,
} from "../modules/admin.js";

export default {
  name: "Active",
  data: () => ({ databases: [], active_connections: [], isAdmin: false }),
  created() {
    this.isAdmin = store.state.isAdmin;
    this.get_active_connections();
  },
  methods: {
    delete_active_connection(id) {
      delete_active_connections(id);
      this.get_active_connections();
    },

    get_active_connections() {
      this.active_connections = [];
      get_all_active_rights().then((databases) => {
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        if (databases) {
          for (let i = 0; i < databases.length; i++)
            this.active_connections.push({
              id: databases[i]["log_id"],
              duration:
                parseInt(databases[i]["log_duration"]) +
                parseInt(databases[i]["log_date"]) -
                timestamp,
              name: databases[i]["db_name"],
              user_name: databases[i]["db_user_name"],
              right: databases[i]["db_user_role"],
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