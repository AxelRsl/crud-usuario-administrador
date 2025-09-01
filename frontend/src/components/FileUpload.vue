<template>
  <div class="file-upload">
    <div v-if="currentFile" class="current-file">
      <img 
        v-if="isImage" 
        :src="`http://localhost:5000/${currentFile}`" 
        :alt="label" 
        class="preview-image"
      >
      <a 
        v-else 
        :href="`http://localhost:5000/${currentFile}`" 
        target="_blank" 
        class="document-link"
      >
        <i class="document-icon">📄</i> Ver {{ documentLabel }} actual
      </a>
    </div>
    <div class="upload-form">
      <input 
        type="file" 
        :id="id" 
        @change="handleFileSelect($event)" 
        :accept="accept" 
        class="file-input"
      >
      <label :for="id" class="file-label">Seleccionar {{ labelAction }}</label>
      <div class="file-restrictions">
        <small>{{ allowedFormats }}</small>
        <small>Tamaño máximo: {{ maxSize }}</small>
      </div>
      <button
        v-if="selectedFile"
        @click="upload"
        class="btn btn-success"
        :disabled="uploading"
      >
        {{ uploading ? 'Subiendo...' : `Subir ${label}` }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    labelAction: {
      type: String,
      default: 'archivo'
    },
    documentLabel: {
      type: String,
      default: 'documento'
    },
    currentFile: {
      type: String,
      default: null
    },
    accept: {
      type: String,
      default: '*/*'
    },
    allowedFormats: {
      type: String,
      default: 'Todos los formatos permitidos'
    },
    maxSize: {
      type: String,
      default: '5MB'
    },
    uploading: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedFile: null
    };
  },
  computed: {
    isImage() {
      return this.accept.includes('image') || 
             (this.currentFile && 
             /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(this.currentFile));
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.$emit('file-selected', { fileType: this.fileType, file });
      }
    },
    upload() {
      if (this.selectedFile) {
        this.$emit('upload', { fileType: this.fileType, file: this.selectedFile });
      }
    }
  }
};
</script>

<style scoped>
.file-upload {
  margin-bottom: 1.5rem;
}

.current-file {
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
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>
