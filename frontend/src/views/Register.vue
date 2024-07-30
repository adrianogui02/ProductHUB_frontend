<template>
  <div class="register-container">
    <h1>ProductHUB</h1>
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" v-model="name" id="name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmação de Senha</label>
          <input type="password" v-model="confirmPassword" id="confirmPassword" required />
        </div>
        <button class="register" type="submit">Registrar</button>
      </form>
      <button @click="goToLogin" class="return">Voltar para Login</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../axios';

export default defineComponent({
  name: 'RegisterComponent',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter();

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        alert('As senhas não coincidem!');
        return;
      }

      try {
        const response = await apiClient.post('/auth/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value,
        });
        alert('Registration successful!');
        router.push('/login'); // Redireciona para a página de login
      } catch (error) {
        alert('Registration failed');
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      handleSubmit,
      goToLogin,
    };
  },
});
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #f06, #f90);
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  padding: 1rem;
}

.register-container h1 {
  font-size: 2.25rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
}

.register-form {
  background-color: #444;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: white;
}

.register-form h2 {
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

.register {
  margin-top: 1em;
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

.register:hover {
  background-color: rgb(151, 23, 74);
}

.return {
  background-color: #42a8fc;
  width: 100%;
  padding: 0.7em;
  border: none;
  color: white;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
}

.return:hover {
  background-color: #3280c0;
}

/* Responsividade */
@media (max-width: 480px) {
  .register-container h1 {
    font-size: 1.75rem;
  }

  .register-form {
    padding: 1.5rem;
    width: 80%;
  }

  .register-form h2 {
    font-size: 1.25rem;
  }
}
</style>
