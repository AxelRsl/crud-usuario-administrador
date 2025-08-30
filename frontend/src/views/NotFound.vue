<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>La página que estás buscando no existe o ha sido movida.</p>
    <router-link to="/" class="btn">Volver a inicio</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 3rem 0;
}

.not-found h1 {
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.not-found h2 {
  margin-bottom: 1.5rem;
}

.not-found p {
  margin-bottom: 2rem;
  color: #7f8c8d;
}
</style>
