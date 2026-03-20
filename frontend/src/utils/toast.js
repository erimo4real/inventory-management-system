import { ref } from 'vue'

const toasts = ref([])

let toastId = 0

export const toast = {
  success(message, duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type: 'success' })
    setTimeout(() => this.remove(id), duration)
  },

  error(message, duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, message, type: 'error' })
    setTimeout(() => this.remove(id), duration)
  },

  warning(message, duration = 3500) {
    const id = ++toastId
    toasts.value.push({ id, message, type: 'warning' })
    setTimeout(() => this.remove(id), duration)
  },

  info(message, duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type: 'info' })
    setTimeout(() => this.remove(id), duration)
  },

  remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
}

export const useToast = () => {
  return { toast, toasts }
}
