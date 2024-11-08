<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'vue-router';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const username = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const router = useRouter();
const auth = getAuth();

const toggleAuth = () => {
    isLogin.value = !isLogin.value;
    successMessage.value = '';
    errorMessage.value = '';
};

const handleSubmit = async () => {
    successMessage.value = '';
    errorMessage.value = '';
    console.log('Email:', email.value);
    console.log('Password:', password.value);

    try {
        if (isLogin.value) {
            // Iniciar sesión
            await signInWithEmailAndPassword(auth, email.value, password.value);
            console.log('Inicio de sesión exitoso');
            router.push('/Dashboard'); // Redirigir al Dashboard después de un inicio de sesión exitoso
        } else {
            // Registrar usuario
            console.log('Username:', username.value); // Verifica el nombre de usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            await updateProfile(userCredential.user, {
                displayName: username.value
            });
            console.log('Registro exitoso');
            successMessage.value = 'Cuenta creada con éxito. ¡Bienvenido!';
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.code === 'auth/email-already-in-use') {
            errorMessage.value = 'El correo electrónico ya está en uso.';
        } else {
            errorMessage.value = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
        }
    }
};
</script>

<template>
    <div class="auth-container">
        <h1>{{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}</h1>
        <form @submit.prevent="handleSubmit">
            <div class="inputs">
                <div v-if="!isLogin" class="form-group">
                    <label for="Username">Nombre de usuario</label>
                    <input id="Username" v-model="username" type="text" placeholder="Nombre de usuario" required>
                </div>
                <div class="form-group">
                    <label for="Email">Correo</label>
                    <input id="Email" v-model="email" type="email" placeholder="Ejemplo@gmail.com" required>
                </div>
                <div class="form-group">
                    <label for="Password">Contraseña</label>
                    <input id="Password" v-model="password" type="password" placeholder="Contraseña" required>
                </div>
            </div>
            <button type="submit" class="submit-button">{{ isLogin ? "Iniciar sesión" : "Registrarme" }}</button>
        </form>
        <p @click="toggleAuth" class="toggle-auth">
            {{ isLogin ? '¿Aún no tienes una cuenta?' : "¿Ya tienes una cuenta? Inicia sesión" }}
        </p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<style scoped>
.auth-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    font-size: 24px;
    color: #333;
}

.inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #555;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

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
    margin-top: 20px;
}

.submit-button:hover {
    background-color: #027f9a;
}

.toggle-auth {
    margin-top: 20px;
    color: #039fce;
    cursor: pointer;
    transition: color 0.3s;
}

.toggle-auth:hover {
    color: #027f9a;
}

.success-message {
    color: green;
    margin-top: 10px;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>
