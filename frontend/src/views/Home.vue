<template>
  <div class="home">
    <h1>Welcome to ProductHUB</h1>
    <div class="intro-text">Your ultimate solution for managing product information efficiently.</div>
    <div class="card-container">
      <div class="card">
        <i class="fas fa-cube"></i>
        <h2>Manage Products</h2>
        <p>Easily manage product records, track their details, and keep all the information organized.</p>
      </div>
      <div class="card">
        <i class="fas fa-tools"></i>
        <h2>Powerful Features</h2>
        <p>Explore a wide range of features that help you streamline product administration and data management.</p>
      </div>
      <div class="card">
        <i class="fas fa-chart-line"></i>
        <h2>Achieve Success</h2>
        <p>Utilize our tools to enhance business outcomes and help products achieve their full potential.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomePage',
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #f06, #f90);
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: white;
  text-align: center;
  padding: 1rem;
}

.home h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.intro-text {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.card-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.card {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  margin: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .home {
    padding: 2rem 1rem;
    min-height: max-content;
  }

  .home h1 {
    font-size: 2.5rem;
  }

  .intro-text {
    font-size: 1.25rem;
  }

  .card {
    width: 100%;
    padding: 1.5rem;
  }

  .card h2 {
    font-size: 1.25rem;
  }

  .card p {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .home{
    min-height: max-content;
  }
  .home h1 {
    font-size: 2rem;
  }

  .intro-text {
    font-size: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .card h2 {
    font-size: 1rem;
  }

  .card p {
    font-size: 0.75rem;
  }
}
</style>
