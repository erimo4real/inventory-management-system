<template>
  <Loading v-if="isLoading" />
  <template v-else>
    <router-view />
  </template>
  <ToastContainer />
  <ConfirmDialog />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ToastContainer from '@/shared/components/ToastContainer.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import Loading from '@/features/loading/views/Loading.vue'

export default {
  name: 'App',
  components: { ToastContainer, ConfirmDialog, Loading },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = ref(true)

    const onUnauthorized = () => {
      store.commit('auth/CLEAR_AUTH')
      router.push('/login')
    }

    onMounted(async () => {
      await store.dispatch('auth/initAuth')
      window.addEventListener('auth:unauthorized', onUnauthorized)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    })

    onUnmounted(() => {
      window.removeEventListener('auth:unauthorized', onUnauthorized)
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
