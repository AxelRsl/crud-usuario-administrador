<template>
  <div class="profile">
    <h1>Mi Perfil</h1>

    <div v-if="user" class="row">
      <!-- Columna de información personal -->
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Información Personal</h2>
          </div>

          <div v-if="updateSuccess" class="alert alert-success">
            Información actualizada correctamente
          </div>

          <div v-if="error" class="alert alert-danger">
            <div v-if="Array.isArray(error)">
              <ul>
                <li v-for="(err, index) in error" :key="index">{{ err }}</li>
              </ul>
            </div>
            <div v-else>{{ error }}</div>
          </div>

          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="name">Nombre:</label>
              <input
                type="text"
                id="name"
                v-model="userData.name"
                class="form-control"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                v-model="user.email"
                class="form-control"
                disabled
              >
              <small>El correo electrónico no se puede cambiar</small>
            </div>

            <div class="form-group">
              <label for="age">Edad:</label>
              <input
                type="number"
                id="age"
                v-model="userData.age"
                class="form-control"
                required
                min="18"
              >
            </div>

            <div class="form-group">
              <label for="city">Ciudad:</label>
              <input
                type="text"
                id="city"
                v-model="userData.city"
                class="form-control"
                required
              >
            </div>

            <div class="form-group">
              <label for="gender">Sexo:</label>
              <select id="gender" v-model="userData.gender" class="form-control" required>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <button type="submit" class="btn btn-block" :disabled="updating">
              {{ updating ? 'Actualizando...' : 'Actualizar Información' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Columna para subir documentos -->
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Documentos</h2>
          </div>

          <div class="document-section">
            <h3>Fotografía</h3>
            <div v-if="user.photo" class="current-document">
              <img :src="`http://localhost:5000/${user.photo}`" alt="Foto de perfil" class="preview-image">
              <p>Foto actual</p>
            </div>
            <div class="upload-form">
              <input type="file" id="photo" @change="handleFileSelect('photo', $event)" accept="image/*" class="file-input">
              <label for="photo" class="file-label">Seleccionar nueva foto</label>
              <div class="file-restrictions">
                <small>Formatos permitidos: JPG, PNG, GIF, etc. (cualquier imagen)</small>
                <small>Tamaño máximo: 5MB</small>
              </div>
              <button
                v-if="selectedFiles.photo"
                @click="uploadFile('photo')"
                class="btn btn-success"
                :disabled="uploading.photo"
              >
                {{ uploading.photo ? 'Subiendo...' : 'Subir Foto' }}
              </button>
            </div>
          </div>

          <div class="document-section">
            <h3>Currículum Vitae</h3>
            <div v-if="user.cv" class="current-document">
              <a :href="`http://localhost:5000/${user.cv}`" target="_blank" class="document-link">
                <i class="document-icon">📄</i> Ver CV actual
              </a>
            </div>
            <div class="upload-form">
              <input type="file" id="cv" @change="handleFileSelect('cv', $event)" accept=".pdf,.doc,.docx" class="file-input">
              <label for="cv" class="file-label">Seleccionar nuevo CV</label>
              <div class="file-restrictions">
                <small>Formatos permitidos: PDF, DOC, DOCX</small>
                <small>Tamaño máximo: 5MB</small>
              </div>
              <button
                v-if="selectedFiles.cv"
                @click="uploadFile('cv')"
                class="btn btn-success"
                :disabled="uploading.cv"
              >
                {{ uploading.cv ? 'Subiendo...' : 'Subir CV' }}
              </button>
            </div>
          </div>

          <div class="document-section">
            <h3>Recibo de Teléfono/Luz</h3>
            <div v-if="user.bill" class="current-document">
              <a :href="`http://localhost:5000/${user.bill}`" target="_blank" class="document-link">
                <i class="document-icon">📄</i> Ver recibo actual
              </a>
            </div>
            <div class="upload-form">
              <input type="file" id="bill" @change="handleFileSelect('bill', $event)" accept=".pdf,image/*" class="file-input">
              <label for="bill" class="file-label">Seleccionar nuevo recibo</label>
              <div class="file-restrictions">
                <small>Formatos permitidos: PDF, JPG, PNG, etc.</small>
                <small>Tamaño máximo: 5MB</small>
              </div>
              <button
                v-if="selectedFiles.bill"
                @click="uploadFile('bill')"
                class="btn btn-success"
                :disabled="uploading.bill"
              >
                {{ uploading.bill ? 'Subiendo...' : 'Subir Recibo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-user-message">
      <p>Debes iniciar sesión para ver tu perfil.</p>
      <router-link to="/login" class="btn">Iniciar Sesión</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      userData: {
        name: '',
        age: '',
        city: '',
        gender: ''
      },
      selectedFiles: {
        photo: null,
        cv: null,
        bill: null
      },
      uploading: {
        photo: false,
        cv: false,
        bill: false
      },
      updating: false,
      updateSuccess: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    // Observar cambios en el usuario para actualizar el formulario
    user: {
      handler(newUser) {
        if (newUser) {
          this.initUserData();
        }
      },
      immediate: true
    }
  },
  methods: {
    // Inicializar datos del formulario con la información del usuario
    initUserData() {
      if (this.user) {
        this.userData = {
          name: this.user.name,
          age: this.user.age,
          city: this.user.city,
          gender: this.user.gender
        };
      }
    },

    // Actualizar perfil de usuario
    updateProfile() {
      this.updating = true;
      this.updateSuccess = false;

      this.$store.dispatch('updateUser', {
        id: this.user.id,
        ...this.userData
      })
      .then(() => {
        this.updating = false;
        this.updateSuccess = true;

        // Ocultar mensaje de éxito después de unos segundos
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      })
      .catch(() => {
        this.updating = false;
      });
    },

    // Manejar selección de archivo
    handleFileSelect(fileType, event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFiles[fileType] = file;
      }
    },

    // Subir archivo al servidor
    uploadFile(fileType) {
      const file = this.selectedFiles[fileType];

      if (!file) return;

      this.uploading[fileType] = true;

      this.$store.dispatch('uploadFile', {
        fileType,
        file
      })
      .then(() => {
        this.uploading[fileType] = false;
        this.selectedFiles[fileType] = null;

        // Resetear el input de archivo
        const fileInput = document.getElementById(fileType);
        if (fileInput) {
          fileInput.value = '';
        }
      })
      .catch(() => {
        this.uploading[fileType] = false;
      });
    }
  },
  created() {
    this.$store.dispatch('clearError');
    // El método initUserData se llamará automáticamente desde el watcher
  }
};
</script>

<style scoped>
.profile h1 {
  margin-bottom: 2rem;
}

.document-section {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.document-section:last-child {
  border-bottom: none;
}

.document-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.current-document {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.document-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  text-decoration: none;
}

.document-icon {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 0.75rem 1rem;
  background: #f1f1f1;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.file-label:hover {
  background: #e1e1e1;
}

.file-restrictions {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

small {
  color: #7f8c8d;
  font-size: 0.8rem;
}

.no-user-message {
  text-align: center;
  margin-top: 2rem;
}

.no-user-message p {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.no-user-message .btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
</style>
