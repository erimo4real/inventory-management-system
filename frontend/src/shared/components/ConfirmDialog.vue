<template>
  <div v-if="visible" class="confirm-backdrop" @click="handleCancel">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-header">
        <h4>{{ title }}</h4>
      </div>
      <div class="confirm-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-actions">
        <button class="btn btn-outline" @click="handleCancel">Cancel</button>
        <button class="btn btn-danger" @click="handleConfirm">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

const state = reactive({
  visible: false,
  title: '',
  message: ''
})

const resolveQueue = []

export function showConfirm(message, title = 'Confirm') {
  state.visible = true
  state.title = title
  state.message = message
  return new Promise((resolve) => {
    resolveQueue.push(resolve)
  })
}

function close() {
  state.visible = false
  state.title = ''
  state.message = ''
}

export default {
  name: 'ConfirmDialog',
  setup() {
    const handleConfirm = () => {
      const fns = resolveQueue.splice(0)
      fns.forEach(fn => fn(true))
      close()
    }
    const handleCancel = () => {
      const fns = resolveQueue.splice(0)
      fns.forEach(fn => fn(false))
      close()
    }
    return { ...state, handleConfirm, handleCancel }
  }
}
</script>

<style scoped>
.confirm-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.confirm-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.confirm-header h4 {
  margin: 0 0 12px;
  font-size: 18px;
  color: var(--gray-900, #1a1a2e);
}
.confirm-body p {
  margin: 0 0 20px;
  color: var(--gray-600, #6b7280);
  font-size: 14px;
  line-height: 1.5;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-danger {
  padding: 8px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
.btn-danger:hover {
  background: #dc2626;
}
</style>
