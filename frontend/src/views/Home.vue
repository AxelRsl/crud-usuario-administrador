<template>
  <div class="home">
    <h1 v-if="user">Bienvenido, {{ user.name }}</h1>
    <div v-if="user" class="role-badge" :class="user.role === 'admin' ? 'role-admin' : 'role-client'">
      {{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">¿Qué puedes hacer?</h2>
      </div>

      <div class="features">
        <div class="feature-item">
          <h3>Gestiona tu Perfil</h3>
          <p>Actualiza tu información personal y gestiona tus documentos subidos.</p>
          <router-link to="/profile" class="btn">Ir a Mi Perfil</router-link>
        </div>

        <div v-if="isAdmin" class="feature-item">
          <h3>Administra Usuarios</h3>
          <p>Gestiona a todos los usuarios registrados en el sistema.</p>
          <router-link to="/admin" class="btn">Panel de Administración</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  }
};
</script>

<style scoped>
.home h1 {
  margin-bottom: 1rem;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 2rem;
  color: white;
}

.role-admin {
  background-color: #e74c3c;
}

.role-client {
  background-color: #3498db;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.feature-item {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.feature-item h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-item p {
  margin-bottom: 1.5rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
