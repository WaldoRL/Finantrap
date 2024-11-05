<script setup>
import { ref, onMounted } from 'vue';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { Auth } from '../firebase.js';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const user = ref(null);
const transactions = ref([]);
const loading = ref(true);
const error = ref(null);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Ingresos',
      backgroundColor: '#039fce',
      data: []
    },
    {
      label: 'Gastos',
      backgroundColor: '#f44336',
      data: []
    }
  ]
});

const fetchTransactions = () => {
  const db = getDatabase();
  const userId = user.value.uid;
  const transactionsRef = dbRef(db, `transactions`);

  onValue(transactionsRef, (snapshot) => {
    const data = snapshot.val();
    const userTransactions = [];
    const income = {};
    const expenses = {};
    
    for (let id in data) {
      if (data[id].userId === userId) {
        const date = new Date(data[id].Date).toLocaleDateString();
        data[id].Date = date;
        userTransactions.push({ id, ...data[id] });

        // Collecting data for chart
        if (data[id].type === 'Ingresos') {
          income[date] = (income[date] || 0) + data[id].amount;
        } else if (data[id].type === 'Gastos') {
          expenses[date] = (expenses[date] || 0) + data[id].amount;
        }
      }
    }

    transactions.value = userTransactions;
    chartData.value.labels = Object.keys(income).concat(Object.keys(expenses)).filter((v, i, a) => a.indexOf(v) === i);
    chartData.value.datasets[0].data = chartData.value.labels.map(date => income[date] || 0);
    chartData.value.datasets[1].data = chartData.value.labels.map(date => expenses[date] || 0);

    loading.value = false;
  }, (error) => {
    console.error(error);
    loading.value = false;
    error.value = 'Error fetching transactions';
  });
};

onMounted(() => {
  user.value = Auth.currentUser;
  if (user.value) {
    fetchTransactions();
  } else {
    error.value = 'User is not authenticated';
  }
});
</script>

<template>
    <div class="dashboard-container">
      <h1>Dashboard</h1>
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
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.amount }}</td>
                <td>{{ transaction.Date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="chart-container">
          <Bar 
            :data="chartData" 
            :options="{ 
              scales: {
                x: {
                  barThickness: 10 // Esto hará que las barras sean más delgadas
                }
              }
            }"
          />
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
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .table-container, .chart-container {
    flex: 1;
    margin: 0 10px;
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
  
  .chart-container {
    max-width: 600px;
  }
  </style>
  