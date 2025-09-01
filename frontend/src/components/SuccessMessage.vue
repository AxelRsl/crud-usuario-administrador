<template>
  <div v-if="message" class="alert alert-success">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'SuccessMessage',
  props: {
    message: {
      type: [String, null],
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

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}
</style>
