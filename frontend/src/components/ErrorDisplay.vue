<template>
  <div v-if="error" class="alert alert-danger">
    <div v-if="Array.isArray(error)">
      <ul>
        <li v-for="(err, index) in error" :key="index">{{ err }}</li>
      </ul>
    </div>
    <div v-else>{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorDisplay',
  props: {
    error: {
      type: [Array, String, null],
      default: null
    }
  }
}
</script>

<style scoped>
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
