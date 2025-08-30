<template>
  <div class="admin-panel">
    <h1>Panel de Administración</h1>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Gestión de Usuarios</h2>
      </div>

      <div v-if="loading" class="text-center loading">
        Cargando usuarios...
      </div>

      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Edad</th>
              <th>Ciudad</th>
              <th>Sexo</th>
              <th>Rol</th>
              <th>Documentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.city }}</td>
              <td>{{ user.gender }}</td>
              <td>
                <span class="badge" :class="user.role === 'admin' ? 'badge-admin' : 'badge-client'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <div class="document-icons">
                  <span v-if="user.photo" class="document-badge" title="Fotografía">📷</span>
                  <span v-if="user.cv" class="document-badge" title="CV">📄</span>
                  <span v-if="user.bill" class="document-badge" title="Recibo">🧾</span>
                </div>
              </td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click="confirmDelete(user)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="users.length === 0" class="empty-state">
          No hay usuarios registrados en el sistema.
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar usuario -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete.name }}</strong>?</p>
        <p>Esta acción no se puede deshacer y eliminará también todos los documentos asociados.</p>
        <div class="modal-actions">
          <button class="btn" @click="cancelDelete">Cancelar</button>
          <button class="btn btn-danger" @click="deleteUser" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar Usuario' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminPanel',
  data() {
    return {
      users: [],
      loading: true,
      showDeleteModal: false,
      userToDelete: null,
      deleting: false
    };
  },
  methods: {
    loadUsers() {
      this.loading = true;
      this.$store.dispatch('loadUsers')
        .then(users => {
          this.users = users;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error al cargar usuarios:', error);
          this.loading = false;
        });
    },
    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.userToDelete = null;
      this.showDeleteModal = false;
    },
    deleteUser() {
      this.deleting = true;

      axios.delete(`http://localhost:5000/api/users/${this.userToDelete._id}`)
        .then(() => {
          this.users = this.users.filter(user => user._id !== this.userToDelete._id);
          this.showDeleteModal = false;
          this.userToDelete = null;
          this.deleting = false;
        })
        .catch(error => {
          console.error('Error al eliminar usuario:', error);
          this.deleting = false;
          // Mantener el modal abierto en caso de error
        });
    }
  },
  created() {
    this.loadUsers();
  }
};
</script>

<style scoped>
.admin-panel h1 {
  margin-bottom: 2rem;
}

.loading {
  padding: 2rem;
  font-style: italic;
  color: #7f8c8d;
}

.text-center {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.badge-admin {
  background-color: #e74c3c;
}

.badge-client {
  background-color: #3498db;
}

.document-icons {
  display: flex;
  gap: 0.5rem;
}

.document-badge {
  font-size: 1.2rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-content h3 {
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
</style>

