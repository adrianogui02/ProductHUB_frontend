<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const showNavbar = computed(() => !['/login', '/register'].includes(route.path));
    
    return {
      showNavbar,
    };
  },
});
</script>

<style>
/* Adicione seu estilo aqui */
</style>
