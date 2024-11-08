<script setup>
import { ref, onMounted } from 'vue';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { Auth } from '../firebase.js';

const user = ref(null);
const userName = Auth.currentUser.displayName;
const transactions = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchUserData = () => {
  const db = getDatabase();
  const userId = user.value.uid;
  const userRef = dbRef(db, `users/${userId}`);

  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      userName.value = data.name;
    }
  });
};

const fetchTransactions = () => {
  const db = getDatabase();
  const userId = user.value.uid;
  const transactionsRef = dbRef(db, `transactions`);

  onValue(transactionsRef, (snapshot) => {
    const data = snapshot.val();
    const userTransactions = [];

    for (let id in data) {
      if (data[id].userId === userId) {
        const date = new Date(data[id].Date).toLocaleDateString();
        data[id].Date = date;
        userTransactions.push({ id, ...data[id] });
      }
    }

    transactions.value = userTransactions;
    loading.value = false;
  }, (error) => {
    console.error(error);
    loading.value = false;
    error.value = 'Error cargando transacciones';
  });
};

onMounted(() => {
  user.value = Auth.currentUser;
  if (user.value) {
    fetchUserData();
    fetchTransactions();
  } else {
    error.value = 'Usuario no autenticado';
  }
});
</script>

<template>
  <div class="dashboard-container">
    <h1>Bienvenido, {{ userName }}!</h1>
    <div v-if="loading">Cargando transacciones...</div>
    <div v-if="error">{{ error }}</div>
    <div class="content">
      <div class="table-container">
        <table v-if="!loading && !error">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id" :class="{'gasto': transaction.type === 'Gastos'}">
              <td>{{ transaction.type }}</td>
              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.Date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 24px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
}

.table-container {
  flex: 1;
  margin: 10px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #039fce;
  color: white;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

tbody tr.gasto td {
  color: red; /* Color rojo para los gastos */
}

@media(min-width: 768px) {
  .content {
    flex-direction: row;
  }

  .table-container {
    margin: 0 10px;
  }
}
</style>
