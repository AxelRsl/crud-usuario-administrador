<template>
  <div class="auth-page">
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="system-title">Sistema de Gestión de Usuarios</h1>
          <h2 class="auth-title">Iniciar Sesión</h2>
        </div>
        
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  border-color: #03a9f4;
  box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.2);
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #03a9f4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #0288d1;
}

.btn-primary:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

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

.alert {
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}
</style>
