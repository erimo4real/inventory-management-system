<template>
  <Loading v-if="isLoading" />
  <template v-else>
    <router-view />
  </template>
  <ToastContainer />
</template>

<script>
import { ref, onMounted } from 'vue'
import ToastContainer from '@/shared/components/ToastContainer.vue'
import Loading from '@/features/loading/views/Loading.vue'

export default {
  name: 'App',
  components: { ToastContainer, Loading },
  setup() {
    const isLoading = ref(true)

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 1500)
    })

    return { isLoading }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: #f5f7fa;
  color: #1a1a2e;
}

#app {
  min-height: 100vh;
}
</style>
