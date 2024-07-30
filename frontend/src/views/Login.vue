<template>
  <div class="login-container">
    <h1>ProductHUB</h1>
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <button class="register-button" @click="goToRegister">Registrar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../axios'; 

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        const response = await apiClient.post('/auth/login', {
          email: email.value,
          password: password.value,
        });
        console.log(response.data);
        if (response.data.status) {
          localStorage.setItem('token', response.data.data.access_token);
          localStorage.setItem('username', response.data.data.user.name);
          alert('Login successful!');
          router.push('/'); // Redireciona para a página Home
        } else {
          alert('Login failed: ' + response.data.message);
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Login failed');
      }
    };

    const goToRegister = () => {
      router.push('/register'); // Redireciona para a página de registro
    };

    return {
      email,
      password,
      handleSubmit,
      goToRegister,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #f06, #f90);
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  padding: 1rem;
}

.login-container h1 {
  font-size: 2.25rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
}

.login-form {
  background-color: #444;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: white;
}

.login-form h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
  border: 1px solid white;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.7em;
  background-color: #f06;
  border: none;
  color: white;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 1em;
}

button:hover {
  background-color: rgb(151, 23, 74);
}

.register-button {
  background-color: #f90;
}

.register-button:hover {
  background-color: rgb(185, 120, 21);
}

/* Responsividade */
@media (max-width: 480px) {
  .login-container h1 {
    font-size: 1.75rem;
  }

  .login-form {
    padding: 1.5rem;
    width: 80%;
  }

  .login-form h2 {
    font-size: 1.25rem;
  }
}
</style>
