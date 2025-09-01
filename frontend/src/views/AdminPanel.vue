<template>
  <div class="admin-panel">
    <h1>Panel de Administración</h1>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Gestión de Usuarios</h2>
      </div>
      
      <div v-if="error" class="alert alert-danger">
        <div v-if="Array.isArray(error)">
          <ul>
            <li v-for="(err, index) in error" :key="index">{{ err }}</li>
          </ul>
        </div>
        <div v-else>{{ error }}</div>
      </div>

      <div v-if="loading" class="text-center loading">
        Cargando usuarios...
      </div>

      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable" :class="{'active-sort': sortKey === 'name'}">
                Nombre 
                <span class="sort-icon" v-if="sortKey === 'name'">
                  {{ sortOrder === 1 ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="sortBy('email')" class="sortable" :class="{'active-sort': sortKey === 'email'}">
                Correo
                <span class="sort-icon" v-if="sortKey === 'email'">
                  {{ sortOrder === 1 ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="sortBy('age')" class="sortable" :class="{'active-sort': sortKey === 'age'}">
                Edad 
                <span class="sort-icon" v-if="sortKey === 'age'">
                  {{ sortOrder === 1 ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="sortBy('city')" class="sortable" :class="{'active-sort': sortKey === 'city'}">
                Ciudad
                <span class="sort-icon" v-if="sortKey === 'city'">
                  {{ sortOrder === 1 ? '↓' : '↑' }}
                </span>
              </th>
              <th>Sexo</th>
              <th>Rol</th>
              <th>Documentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in sortedUsers" :key="user._id">
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
export default {
  name: 'AdminPanel',
  data() {
    return {
      users: [],
      loading: true,
      showDeleteModal: false,
      userToDelete: null,
      deleting: false,
      sortKey: '', // Campo por el que se ordena
      sortOrder: 1  // 1 para ascendente, -1 para descendente
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    sortedUsers() {
      // Si no hay clave de ordenamiento, devuelve los usuarios sin cambios
      if (!this.sortKey) return this.users;
      
      // Crea una copia del array para no modificar el original
      const usersArray = [...this.users];
      
      // Ordena según la clave y el orden
      return usersArray.sort((a, b) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];
        
        // Convierte a número si es la edad
        if (this.sortKey === 'age') {
          valueA = Number(valueA || 0);
          valueB = Number(valueB || 0);
        } 
        // Para campos de texto, asegúrate de que sean strings y no sean null/undefined
        else {
          valueA = String(valueA || '').toLowerCase();
          valueB = String(valueB || '').toLowerCase();
        }
        
        if (valueA < valueB) return -1 * this.sortOrder;
        if (valueA > valueB) return 1 * this.sortOrder;
        return 0;
      });
    }
  },
  methods: {
    // Método para ordenar por una columna
    sortBy(key) {
      // Si ya estamos ordenando por esta columna, cambiamos el orden
      if (this.sortKey === key) {
        this.sortOrder = -this.sortOrder;
      } else {
        // Si es una nueva columna, establecemos orden ascendente
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },
    
    loadUsers() {
      this.loading = true;
      this.$store.dispatch('clearError'); // Limpia errores previos
      this.$store.dispatch('loadUsers')
        .then(users => {
          this.users = users;
          this.loading = false;
        })
        .catch(() => {
          // El store ya maneja los errores y los muestra
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

      this.$store.dispatch('deleteUser', this.userToDelete._id)
        .then(() => {
          this.users = this.users.filter(user => user._id !== this.userToDelete._id);
          this.showDeleteModal = false;
          this.userToDelete = null;
          this.deleting = false;
        })
        .catch(() => {
          this.deleting = false;
          // Mantener el modal abierto en caso de error
        });
    }
  },
  created() {
    this.$store.dispatch('clearError');
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

/* Estilos para los encabezados ordenables */
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 22px; /* Espacio para el icono */
  transition: background-color 0.2s;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sort-icon {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
  color: #03a9f4; /* Color azul para resaltar */
}

/* Añadir indicador visual para columnas ordenables incluso sin hover */
.sortable::after {
  content: '⇅';
  opacity: 0.3;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
}

/* Ocultar el indicador cuando está en hover */
.sortable:hover::after {
  opacity: 0;
}

/* Clase específica para ocultar el indicador cuando se está ordenando */
th.sortable.active-sort::after {
  opacity: 0;
}

/* Estilos adicionales para mejorar la apariencia de columnas ordenables */
th.sortable {
  background-color: rgba(3, 169, 244, 0.03);
  border-bottom: 2px solid rgba(3, 169, 244, 0.2);
}

th.active-sort {
  background-color: rgba(3, 169, 244, 0.07);
  border-bottom: 2px solid rgba(3, 169, 244, 0.7);
}

/* Estilos para alertas de error */
.alert {
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 6px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}
</style>

