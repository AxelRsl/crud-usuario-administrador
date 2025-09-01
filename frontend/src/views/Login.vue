<template>
  <div class="auth-page">
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="system-title">Sistema de Gestión de Usuarios</h1>
          <h2 class="auth-title">Iniciar Sesión</h2>
        </div>
        
        <ErrorDisplay :error="error" />
        
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
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
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              required
              placeholder="Ingrese su contraseña"
            >
          </div>
          
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Procesando...' : 'Iniciar Sesión' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorDisplay from '../components/ErrorDisplay.vue';

export default {
  name: 'Login',
  components: {
    ErrorDisplay
  },
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
/* Estilos específicos de la página de inicio de sesión */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: white;
  padding: 20px;
}

.auth-content {
  width: 100%;
  max-width: 480px;
}

.auth-header {
  margin-bottom: 30px;
  text-align: center;
}

.system-title {
  color: #03a9f4;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.auth-title {
  font-size: 1.4rem;
  color: #333;
  font-weight: 500;
}

.auth-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  padding: 30px;
}

.auth-form {
  margin-bottom: 20px;
}

/* Botón específico del formulario de inicio de sesión */
.btn-primary {
  width: 100%;
  margin-top: 10px;
}

/* Estilos del pie de página de autenticación */
.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.95rem;
  color: #666;
}

.auth-footer a {
  color: #03a9f4;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
