import { ref } from 'vue'

const loading = ref(false)

export const useLoading = () => {
  const show = () => loading.value = true
  const hide = () => loading.value = false
  
  return { loading, show, hide }
}

export default { loading }
