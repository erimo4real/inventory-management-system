import { toast } from './toast'

export const showSuccess = (message) => {
  toast.success(message)
}

export const showError = (message) => {
  toast.error(message)
}

export const showWarning = (message) => {
  toast.warning(message)
}

export const showInfo = (message) => {
  toast.info(message)
}

export const showConfirm = (message) => {
  return confirm(message)
}

export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export const throttle = (fn, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str, length = 50) => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const generateSKU = (category) => {
  const prefix = category?.substring(0, 3).toUpperCase() || 'SKU'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${random}`
}
