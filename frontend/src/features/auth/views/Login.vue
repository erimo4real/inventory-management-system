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
          <h1>SIMS</h1>
          <p>Smart Inventory Management System</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
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

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter your password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isRegistering ? 'Create Account' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <p v-if="!isRegistering">
            Don't have an account?
            <a @click="isRegistering = true" class="link">Create Account</a>
          </p>
          <p v-else>
            Already have an account?
            <a @click="isRegistering = false" class="link">Sign In</a>
          </p>
        </div>

        <div class="demo-credentials">
          <p class="demo-title">Demo Credentials</p>
          <div class="demo-users">
            <button type="button" @click="fillCredentials('admin@example.com')" class="demo-btn">Admin</button>
            <button type="button" @click="fillCredentials('manager@example.com')" class="demo-btn">Manager</button>
            <button type="button" @click="fillCredentials('staff@example.com')" class="demo-btn">Staff</button>
          </div>
          <p class="demo-password">Password: admin123</p>
        </div>
      </div>
    </div>
    <div class="auth-bg">
      <div class="bg-pattern"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isRegistering = ref(false)
    const showPassword = ref(false)
    const form = ref({
      email: '',
      password: '',
      name: ''
    })
    
    const loading = computed(() => store.getters['auth/authLoading'])
    const error = computed(() => store.getters['auth/authError'])
    
    const fillCredentials = (email) => {
      form.value.email = email
      form.value.password = 'admin123'
    }
    
    const handleSubmit = async () => {
      try {
        if (isRegistering.value) {
          await store.dispatch('auth/register', {
            email: form.value.email,
            password: form.value.password,
            name: form.value.name,
            role: 'staff'
          })
        } else {
          await store.dispatch('auth/login', {
            email: form.value.email,
            password: form.value.password
          })
        }
        router.push('/')
      } catch (err) {
        // Error handled by store
      }
    }
    
    return {
      form,
      isRegistering,
      showPassword,
      loading,
      error,
      fillCredentials,
      handleSubmit
    }
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
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
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

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  padding: 4px;
}

.toggle-password:hover {
  color: var(--gray-700);
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.forgot-link {
  font-size: 13px;
  color: var(--primary-color);
}

.forgot-link:hover {
  text-decoration: underline;
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

.auth-footer {
  text-align: center;
  color: var(--gray-600);
  font-size: 14px;
}

.link {
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.demo-credentials {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
  text-align: center;
}

.demo-title {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.demo-users {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
}

.demo-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition);
}

.demo-btn:hover {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.demo-password {
  font-size: 12px;
  color: var(--gray-500);
}

.alert {
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
}
</style>
