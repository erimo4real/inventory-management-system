<template>
  <router-view />
  <ToastContainer />
  <ConfirmDialog />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ToastContainer from '@/shared/components/ToastContainer.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

export default {
  name: 'App',
  components: { ToastContainer, ConfirmDialog },
  setup() {
    const store = useStore()
    const router = useRouter()

    const onUnauthorized = () => {
      store.commit('auth/CLEAR_AUTH')
      router.push('/login')
    }

    onMounted(() => {
      window.addEventListener('auth:unauthorized', onUnauthorized)
    })

    onUnmounted(() => {
      window.removeEventListener('auth:unauthorized', onUnauthorized)
    })

    return {}
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
