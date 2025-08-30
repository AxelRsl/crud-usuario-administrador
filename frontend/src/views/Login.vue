<template>
  <div class="auth-container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Iniciar Sesión</h2>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            required
            placeholder="Ingrese su correo electrónico"
          >
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            required
            placeholder="Ingrese su contraseña"
          >
        </div>
        <button type="submit" class="btn btn-block" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Iniciar Sesión' }}
        </button>
      </form>
      <div class="auth-footer">
        ¿No tienes una cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
      .then(() => {
        this.loading = false;
        this.$router.push('/');
      })
      .catch(() => {
        this.loading = false;
      });
    }
  },
  created() {
    this.$store.dispatch('clearError');
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 0;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
