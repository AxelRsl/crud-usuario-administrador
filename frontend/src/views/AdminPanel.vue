<template>
  <div class="admin-panel">
    <h1>Panel de Administración</h1>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Gestión de Usuarios</h2>
        <div class="filter-options">
          <label class="filter-toggle">
            <input type="checkbox" v-model="showOnly18Plus">
            <span class="filter-label">Mostrar solo usuarios de 18 años o más</span>
          </label>
        </div>
      </div>
      
      <ErrorDisplay :error="error" />

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
import ErrorDisplay from '../components/ErrorDisplay.vue';

export default {
  name: 'AdminPanel',
  components: {
    ErrorDisplay
  },
  data() {
    return {
      users: [],
      loading: true,
      showDeleteModal: false,
      userToDelete: null,
      deleting: false,
      sortKey: '', // Campo por el que se ordena
      sortOrder: 1,  // 1 para ascendente, -1 para descendente
      showOnly18Plus: true // Por defecto, mostrar solo usuarios de 18+ años
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    // Usuarios filtrados (por edad si es necesario)
    filteredUsers() {
      return this.showOnly18Plus 
        ? this.users.filter(user => Number(user.age) >= 18)
        : this.users;
    },
    
    // Usuarios ordenados según el criterio seleccionado
    sortedUsers() {
      // Sin ordenamiento, devolver solo los filtrados
      if (!this.sortKey) return this.filteredUsers;
      
      return [...this.filteredUsers].sort((a, b) => {
        // Extraer y normalizar los valores a comparar
        const isNumeric = this.sortKey === 'age';
        const valueA = isNumeric ? Number(a[this.sortKey] || 0) : String(a[this.sortKey] || '').toLowerCase();
        const valueB = isNumeric ? Number(b[this.sortKey] || 0) : String(b[this.sortKey] || '').toLowerCase();
        
        // Comparar según el orden seleccionado
        return valueA === valueB ? 0 : (valueA < valueB ? -1 : 1) * this.sortOrder;
      });
    }
  },
  methods: {
    // Método para ordenar por una columna
    sortBy(key) {
      this.sortOrder = this.sortKey === key ? -this.sortOrder : 1;
      this.sortKey = key;
    },
    
    // Cargar lista de usuarios
    async loadUsers() {
      this.loading = true;
      this.$store.dispatch('clearError');
      
      try {
        this.users = await this.$store.dispatch('loadUsers');
      } catch (error) {
        // Los errores ya se manejan en el store
      } finally {
        this.loading = false;
      }
    },
    // Abrir modal de confirmación de eliminación
    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    
    // Cancelar proceso de eliminación
    cancelDelete() {
      this.userToDelete = null;
      this.showDeleteModal = false;
    },
    
    // Eliminar usuario
    async deleteUser() {
      if (!this.userToDelete) return;
      
      this.deleting = true;
      
      try {
        await this.$store.dispatch('deleteUser', this.userToDelete._id);
        // Eliminar usuario de la lista local
        this.users = this.users.filter(user => user._id !== this.userToDelete._id);
        this.showDeleteModal = false;
        this.userToDelete = null;
      } catch (error) {
        // Modal permanece abierto en caso de error
      } finally {
        this.deleting = false;
      }
    }
  },
  created() {
    this.$store.dispatch('clearError');
    this.loadUsers();
  }
};
</script>

<style scoped>
/* Estilos de diseño y generales */
.admin-panel h1 {
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.loading, .empty-state {
  padding: 2rem;
  font-style: italic;
  color: #7f8c8d;
  text-align: center;
}

/* Estilos de tarjetas y encabezados */
.card-header {
  display: flex;
  flex-direction: column;
}

.card-title {
  margin-bottom: 10px;
}

/* Estilos de insignias */
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

/* Estilos de botones */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

/* Estilos de documentos */
.document-icons {
  display: flex;
  gap: 0.5rem;
}

.document-badge {
  font-size: 1.2rem;
}

/* Estilos de modal */
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

/* Estilos para encabezados de tabla ordenables */
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 22px;
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
  color: #03a9f4;
}

.sortable::after {
  content: '⇅';
  opacity: 0.3;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
}

.sortable:hover::after,
th.sortable.active-sort::after {
  opacity: 0;
}

th.sortable {
  background-color: rgba(3, 169, 244, 0.03);
  border-bottom: 2px solid rgba(3, 169, 244, 0.2);
}

th.active-sort {
  background-color: rgba(3, 169, 244, 0.07);
  border-bottom: 2px solid rgba(3, 169, 244, 0.7);
}

/* Estilos de filtros */
.filter-options {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.filter-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.filter-label {
  margin-left: 8px;
  font-size: 0.9em;
}
</style>

