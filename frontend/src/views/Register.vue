<template>
  <div class="auth-page">
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="system-title">Sistema de Gestión de Usuarios</h1>
          <h2 class="auth-title">Registro de Usuario</h2>
        </div>
        
        <ErrorDisplay :error="error" />
        
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-group">
            <label for="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              v-model="user.name"
              class="form-control"
              required
              placeholder="Ingrese su nombre completo"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              v-model="user.email"
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
              v-model="user.password"
              class="form-control"
              required
              minlength="8"
              placeholder="Cree una contraseña segura"
            >
            <small class="form-text text-muted">
              La contraseña debe tener al menos 8 caracteres
            </small>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="age">Edad</label>
              <input
                type="number"
                id="age"
                v-model="user.age"
                class="form-control"
                required
                placeholder="Edad"
              >
            </div>
            
            <div class="form-group half">
              <label for="city">Ciudad</label>
              <input
                type="text"
                id="city"
                v-model="user.city"
                class="form-control"
                required
                placeholder="Su ciudad"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="gender">Sexo</label>
              <select id="gender" v-model="user.gender" class="form-control" required>
                <option value="" disabled>Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div class="form-group half">
              <label for="role">Tipo de Usuario</label>
              <select id="role" v-model="user.role" class="form-control" required>
                <option value="" disabled>Seleccionar</option>
                <option value="admin">Administrador</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
          </div>
          
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Procesando...' : 'Registrarse' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorDisplay from '../components/ErrorDisplay.vue';

export default {
  name: 'Register',
  components: {
    ErrorDisplay
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        age: '',
        city: '',
        gender: '',
        role: 'cliente' // Por defecto, el rol será cliente
      },
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
      this.$store.dispatch('register', this.user)
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
/* Estilos específicos de la página de registro */
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
  max-width: 550px; /* Un poco más ancho para el formulario de registro */
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

/* Botón específico del formulario de autenticación */
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

/* Texto de ayuda en formularios */
.form-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 4px;
}
</style>
