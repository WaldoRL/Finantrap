<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { Auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isauthenticated = ref(false);
const router = useRouter();

onAuthStateChanged(Auth, (user) => {
  isauthenticated.value = !!user;
});

const logout = async () => {
  await signOut(Auth);
  isauthenticated.value = false;
  router.push('/Auth');
};
</script>

<template>
  <header class="Navbar">
    <img alt="Finan Logo" class="logo" src="@/assets/logo.png" width="75" height="75">

    <nav v-if="isauthenticated">
      <RouterLink to="/Transactions">Transactions</RouterLink>
      <RouterLink to="/Dashboard">Dashboard</RouterLink>
      <button @click="logout" id="logout" class="custom-button">Logout</button>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
  cursor: pointer; /* Cambia el cursor para indicar que es clicable */
}

.custom-button {
  background-color: #17bbee;
  border: none;
  color: #707070;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.custom-button:hover {
  background-color: #027f9a;
  color: #000000;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

@media (min-width: 1024px) {
  header {
    display: flex;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex;
    flex-wrap: wrap;
  }

  nav {
    text-align: center;
    margin-left: -1rem;
    font-size: 1rem;
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 12px;
  }
}

main {
  text-align: center;
  margin-top: 3rem;
}
</style>
