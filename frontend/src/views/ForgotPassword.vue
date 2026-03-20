<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>SIMS</h1>
        <p>Forgot Password</p>
      </div>

      <form v-if="!emailSent" @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="form.email" type="email" required placeholder="Enter your email" />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <p class="back-link">
          Remember your password? <router-link to="/login">Login</router-link>
        </p>
      </form>

      <div v-else class="success-message">
        <div class="success-icon">✓</div>
        <p>If an account exists with <strong>{{ form.email }}</strong>, you will receive a password reset link shortly.</p>
        <button @click="emailSent = false" class="btn-secondary">Send Again</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { authAPI } from '@/services/api'
import { showSuccess, showError } from '@/utils'

export default {
  name: 'ForgotPassword',
  setup() {
    const form = ref({ email: '' })
    const loading = ref(false)
    const emailSent = ref(false)

    const handleForgotPassword = async () => {
      loading.value = true
      try {
        await authAPI.forgotPassword(form.value.email)
        emailSent.value = true
        showSuccess('Reset link sent to your email')
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to send reset link')
      } finally {
        loading.value = false
      }
    }

    return { form, loading, emailSent, handleForgotPassword }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  color: #4f46e5;
  font-size: 32px;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #1a1a2e;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.back-link a {
  color: #4f46e5;
  text-decoration: none;
}

.success-message {
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.btn-secondary {
  margin-top: 20px;
  padding: 10px 20px;
  background: #f5f7fa;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
