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

          <SuccessMessage v-if="updateSuccess" message="Información actualizada correctamente" />
          
          <ErrorDisplay :error="error" />

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
            <FileUpload
              id="photo"
              label="Foto"
              labelAction="nueva foto"
              documentLabel="foto"
              :currentFile="user.photo"
              accept="image/*"
              allowedFormats="Formatos permitidos: JPG, PNG, GIF, etc. (cualquier imagen)"
              maxSize="5MB"
              :uploading="uploading.photo"
              fileType="photo"
              @file-selected="handleFileSelectedComponent"
              @upload="uploadFileComponent"
            />
          </div>

          <div class="document-section">
            <h3>Currículum Vitae</h3>
            <FileUpload
              id="cv"
              label="CV"
              labelAction="nuevo CV"
              documentLabel="CV"
              :currentFile="user.cv"
              accept=".pdf,.doc,.docx"
              allowedFormats="Formatos permitidos: PDF, DOC, DOCX"
              maxSize="5MB"
              :uploading="uploading.cv"
              fileType="cv"
              @file-selected="handleFileSelectedComponent"
              @upload="uploadFileComponent"
            />
          </div>

          <div class="document-section">
            <h3>Recibo de Teléfono/Luz</h3>
            <FileUpload
              id="bill"
              label="Recibo"
              labelAction="nuevo recibo"
              documentLabel="recibo"
              :currentFile="user.bill"
              accept=".pdf,image/*"
              allowedFormats="Formatos permitidos: PDF, JPG, PNG, etc."
              maxSize="5MB"
              :uploading="uploading.bill"
              fileType="bill"
              @file-selected="handleFileSelectedComponent"
              @upload="uploadFileComponent"
            />
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
import ErrorDisplay from '../components/ErrorDisplay.vue';
import SuccessMessage from '../components/SuccessMessage.vue';
import FileUpload from '../components/FileUpload.vue';

export default {
  name: 'Profile',
  components: {
    ErrorDisplay,
    SuccessMessage,
    FileUpload
  },
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

    // Manejar selección de archivo (método antiguo, mantenido para compatibilidad)
    handleFileSelect(fileType, event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFiles[fileType] = file;
      }
    },

    // Método nuevo para manejar la selección de archivos desde el componente
    handleFileSelectedComponent({ fileType, file }) {
      this.selectedFiles[fileType] = file;
    },

    // Método nuevo para subir archivos desde el componente
    uploadFileComponent({ fileType }) {
      this.uploadFile(fileType);
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

/* Estilos para secciones de documentos */
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

/* Estilos adicionales */
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
</style>
