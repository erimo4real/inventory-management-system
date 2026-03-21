<template>
  <div class="auth-wrapper">
    <!-- Left Side - Branding -->
    <div class="auth-side left-side">
      <div class="side-content">
        <div class="brand-logo">
          <svg width="86" height="48" viewBox="0 0 34 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.00183571 0.3125V7.59485C0.00183571 7.59485 -0.141502 9.88783 2.10473 11.8288L14.5469 23.6837L21.0172 23.6005L19.9794 10.8126L17.5261 7.93369L9.81536 0.3125H0.00183571Z"
              fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M8.25781 17.6914L25.1339 0.3125H33.9991V7.62657C33.9991 7.62657 33.8144 10.0645 32.5743 11.3686L21.0179 23.6875H14.5487L8.25781 17.6914Z"
              fill="rgba(255,255,255,0.7)"/>
          </svg>
          <span class="brand-name">SIMS</span>
        </div>
        
        <div class="side-text">
          <h1>Welcome to SIMS! 👋</h1>
          <p>Smart Inventory Management System - Streamline your business operations with our powerful inventory management solution.</p>
        </div>
        
        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span>Real-time Inventory Tracking</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span>Multi-user Access Control</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <span>Comprehensive Reports</span>
          </div>
        </div>
      </div>
      <div class="side-pattern"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="auth-side right-side">
      <div class="auth-form-wrapper">
        <div class="auth-form-container">
          <div class="form-header">
            <h1>Sign in</h1>
            <p>Please sign-in to your account and start the adventure</p>
          </div>

          <div v-if="error" class="alert alert-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="john@example.com"
                required
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label class="form-label">Password</label>
                <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
              </div>
              <div class="password-wrapper">
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

            <div class="form-group-inline">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="form.remember" />
                <span class="checkmark"></span>
                <span class="checkbox-label">Remember me</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Sign in</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>New on our platform? <router-link to="/login" class="link">Create an account</router-link></p>
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
    
    const showPassword = ref(false)
    const form = ref({
      email: '',
      password: '',
      remember: false
    })
    
    const loading = computed(() => store.getters['auth/authLoading'])
    const error = computed(() => store.getters['auth/authError'])
    
    const fillCredentials = (email) => {
      form.value.email = email
      form.value.password = 'admin123'
    }
    
    const handleSubmit = async () => {
      try {
        await store.dispatch('auth/login', {
          email: form.value.email,
          password: form.value.password
        })
        router.push('/')
      } catch (err) {
        // Error handled by store
      }
    }
    
    return {
      form,
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
.auth-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Left Side - Branding */
.auth-side.left-side {
  flex: 1;
  background: linear-gradient(135deg, #7367f0 0%, #9e8cfc 100%);
  padding: 60px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.side-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.side-content {
  position: relative;
  z-index: 1;
  max-width: 480px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 60px;
}

.brand-name {
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.side-text h1 {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
}

.side-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 40px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
  font-size: 15px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Right Side - Form */
.auth-side.right-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-form-container {
  width: 100%;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--gray-500);
  font-size: 14px;
}

.auth-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.label-row .form-label {
  margin-bottom: 0;
}

.forgot-link {
  font-size: 13px;
  color: var(--primary-color);
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  padding: 4px;
  transition: var(--transition);
}

.toggle-password:hover {
  color: var(--gray-700);
}

.password-wrapper .form-control {
  padding-right: 44px;
}

.form-group-inline {
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.checkbox-wrapper input:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-wrapper input:checked + .checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-label {
  font-size: 13px;
  color: var(--gray-600);
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
  margin-bottom: 32px;
}

.link {
  color: var(--primary-color);
  font-weight: 500;
}

.demo-credentials {
  padding: 20px;
  background: var(--gray-50);
  border-radius: var(--border-radius);
  text-align: center;
  border: 1px solid var(--gray-200);
}

.demo-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-500);
  margin-bottom: 12px;
}

.demo-users {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
}

.demo-btn {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition);
}

.demo-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.demo-password {
  font-size: 12px;
  color: var(--gray-500);
}

/* Responsive */
@media (max-width: 992px) {
  .auth-wrapper {
    flex-direction: column;
  }
  
  .auth-side.left-side {
    padding: 40px;
    min-height: auto;
  }
  
  .side-text h1 {
    font-size: 28px;
  }
  
  .features-list {
    display: none;
  }
  
  .brand-logo {
    margin-bottom: 30px;
  }
  
  .auth-side.right-side {
    padding: 40px 24px;
  }
}
</style>
