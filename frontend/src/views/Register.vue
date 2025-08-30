<template>
  <div class="auth-container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Registro de Usuario</h2>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="name">Nombre Completo:</label>
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
          <label for="email">Correo Electrónico:</label>
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
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            class="form-control"
            required
            placeholder="Cree una contraseña segura"
          >
        </div>
        <div class="form-group">
          <label for="age">Edad:</label>
          <input
            type="number"
            id="age"
            v-model="user.age"
            class="form-control"
            required
            min="18"
            placeholder="Ingrese su edad"
          >
        </div>
        <div class="form-group">
          <label for="city">Ciudad:</label>
          <input
            type="text"
            id="city"
            v-model="user.city"
            class="form-control"
            required
            placeholder="Ingrese su ciudad"
          >
        </div>
        <div class="form-group">
          <label for="gender">Sexo:</label>
          <select id="gender" v-model="user.gender" class="form-control" required>
            <option value="" disabled>Seleccione una opción</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label for="role">Tipo de Usuario:</label>
          <select id="role" v-model="user.role" class="form-control" required>
            <option value="" disabled>Seleccione una opción</option>
            <option value="admin">Administrador</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <button type="submit" class="btn btn-block" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Registrarse' }}
        </button>
      </form>
      <div class="auth-footer">
        ¿Ya tienes una cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
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
