<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M10 16L14 20L22 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#7367f0"/>
                  <stop offset="1" stop-color="#9e8cfc"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send you a reset link</p>
        </div>

        <form v-if="!emailSent" @submit.prevent="handleForgotPassword" class="auth-form">
          <div v-if="error" class="alert alert-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>

        <div v-else class="success-state">
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3>Check Your Email</h3>
          <p>If an account exists with <strong>{{ form.email }}</strong>, you will receive a password reset link shortly.</p>
          <button @click="emailSent = false" class="btn btn-outline">Send Again</button>
        </div>

        <div class="auth-footer">
          <router-link to="/login" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Login
          </router-link>
        </div>
      </div>
    </div>
    <div class="auth-bg">
      <div class="bg-pattern"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { authAPI } from '@/shared/services/api'

export default {
  name: 'ForgotPassword',
  setup() {
    const form = ref({ email: '' })
    const loading = ref(false)
    const emailSent = ref(false)
    const error = ref('')

    const handleForgotPassword = async () => {
      loading.value = true
      error.value = ''
      try {
        await authAPI.forgotPassword(form.value.email)
        emailSent.value = true
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to send reset link'
      } finally {
        loading.value = false
      }
    }

    return { form, loading, emailSent, error, handleForgotPassword }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #7367f0 0%, #9e8cfc 50%, #a78bfa 100%);
  z-index: 0;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.auth-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header .logo {
  margin-bottom: 16px;
  display: inline-block;
}

.auth-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.auth-header p {
  color: var(--gray-500);
  font-size: 14px;
}

.auth-form {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
}

.form-control {
  padding-left: 44px;
}

.btn-lg {
  height: 48px;
  font-size: 15px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-state {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: rgba(40, 199, 111, 0.1);
  color: var(--success-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 12px;
}

.success-state p {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 24px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-600);
  font-size: 14px;
  text-decoration: none;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--primary-color);
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
}
</style>
