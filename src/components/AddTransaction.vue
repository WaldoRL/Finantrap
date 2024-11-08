<script setup>
import { ref } from 'vue';
import { getDatabase, ref as dbRef, push } from 'firebase/database';
import { Auth } from '../firebase.js';

const transactionType = ref(''); // Variable para almacenar el tipo de transacción seleccionado
const amount = ref(0); // Variable para almacenar la cantidad ingresada
const db = getDatabase();
const successMessage = ref('');

const AddTransaction = async (event) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    const user = Auth.currentUser;
    if (user && amount.value != null) {
        const transactionsRef = dbRef(db, `transactions`);
        const newTransaction = {
            type: transactionType.value,
            amount: amount.value,
            Date: new Date().toISOString().slice(0, 10),
            userId: user.uid
        };
        await push(transactionsRef, newTransaction);
        successMessage.value ='Transacción agregada correctamente';
        setTimeout(() => {
            successMessage.value = '';
        }, 3000); // El mensaje desaparecerá después de 3 segundos
        amount.value = 0; // Reiniciar el valor de amount después de agregar la transacción
        transactionType.value = ''; // Reiniciar el valor de transactionType después de agregar la transacción
    }
}
</script>

<template>
    <div class="form-container">
      <h1>Agregar transacción</h1>
      <form @submit="AddTransaction">
        <div class="form-group">
          <label for="transactionType">Tipo de Transacción</label>
          <select v-model="transactionType" id="transactionType" required>
            <option value="" disabled>Selecciona una opción</option>
            <option value="Ingresos">Ingresos</option>
            <option value="Gastos">Gastos</option>
          </select>
        </div>
        <div class="form-group">
          <label for="amount">Cantidad</label>
          <input type="number" v-model="amount" id="amount" placeholder="0.00" required>
        </div>
        <button type="submit" class="submit-button">Agregar</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
</template>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

select,
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

select:focus,
input:focus {
  border-color: #039fce;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #039fce98;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #027f9a;
}

p {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
}
</style>
  