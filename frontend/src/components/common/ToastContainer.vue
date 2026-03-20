<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="item in toasts"
          :key="item.id"
          class="toast"
          :class="item.type"
        >
          <span class="toast-icon">
            {{ item.type === 'success' ? '✓' : item.type === 'error' ? '✕' : item.type === 'warning' ? '⚠' : 'ℹ' }}
          </span>
          <span class="toast-message">{{ item.message }}</span>
          <button class="toast-close" @click="toast.remove(item.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
import { useToast } from '@/utils/toast'

export default {
  name: 'ToastContainer',
  setup() {
    const { toasts, toast } = useToast()
    return { toasts, toast }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 280px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast.warning {
  background: #f59e0b;
  color: white;
}

.toast.info {
  background: #3b82f6;
  color: white;
}

.toast-icon {
  font-size: 16px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
