<template>
  <nav class="navbar">
    <div class="navbar-brand">ProductHUB</div>
    <div class="navbar-toggle" @click="toggleMenu">☰</div>
    <div :class="['navbar-links', { 'navbar-links-visible': menuVisible }]">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/products" class="nav-link">Products</router-link>
      <router-link to="/categories" class="nav-link">Categories</router-link>
    </div>
    <div class="navbar-user">
      <div class="dropdown">
        <button class="dropbtn">{{ username }}</button>
        <div class="dropdown-content">
          <a @click="logout">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavbarComponent',
  setup() {
    const router = useRouter();
    const username = ref(localStorage.getItem('username') || 'Guest');
    const menuVisible = ref(false);

    const toggleMenu = () => {
      menuVisible.value = !menuVisible.value;
    };

    const logout = () => {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      router.push('/login');
    };

    return { username, logout, menuVisible, toggleMenu };
  },
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 1em;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.navbar-brand {
  font-size: 1.5em;
  font-weight: bold;
}

.navbar-toggle {
  display: none;
  font-size: 1.5em;
  cursor: pointer;
}

.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-links .nav-link {
  color: white;
  margin-left: 1em;
  text-decoration: none;
  font-size: 1em;
  transition: color 0.3s;
}

.navbar-links .nav-link:hover {
  color: #42b983;
}

.navbar-user {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5em 1em;
  font-size: 1em;
  transition: background-color 0.3s;
}

.dropbtn:hover {
  background-color: #555;
}

.dropdown-content {
  display: none;
  position: absolute;
  color: white;
  right: 0;
  background-color: #555;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: #555;
}

.dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }

  .navbar-toggle {
    display: block;
  }

  .navbar-links {
    display: none;
    width: 100%;
    flex-direction: column;
  }

  .navbar-links-visible {
    display: flex;
  }

  .navbar-links .nav-link {
    margin: 0.5em 0;
  }

  .navbar-user {
    width: 100%;
    text-align: right;
    margin-top: 0.5em;
  }
}
</style>
