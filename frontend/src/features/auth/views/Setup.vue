<template>
  <div class="setup-wrapper">
    <div class="setup-card">
      <div class="setup-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <h1>System Setup</h1>
        <p>Create your admin account to get started</p>
      </div>

      <div v-if="message" :class="['alert', message.type]">
        {{ message.text }}
      </div>

      <form @submit.prevent="handleSetup" class="setup-form">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" type="text" required placeholder="John Doe" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required placeholder="admin@example.com" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" required placeholder="Min 6 characters" minlength="6" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Setting up...' : 'Create Admin Account' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Setup',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const message = ref(null)
    const form = ref({
      name: '',
      email: '',
      password: ''
    })

    const handleSetup = async () => {
      loading.value = true
      message.value = null

      try {
        const response = await fetch('/api/setup/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        })

        const data = await response.json()

        if (response.ok) {
          message.value = { type: 'success', text: 'Admin account created! Redirecting to login...' }
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          message.value = { type: 'error', text: data.error || 'Setup failed' }
        }
      } catch (err) {
        message.value = { type: 'error', text: 'Connection failed. Is the server running?' }
      } finally {
        loading.value = false
      }
    }

    return { form, loading, message, handleSetup }
  }
}
</script>

<style scoped>
.setup-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.setup-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.setup-header {
  text-align: center;
  margin-bottom: 32px;
}

.setup-header svg {
  color: #667eea;
  margin-bottom: 16px;
}

.setup-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.setup-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.alert.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
