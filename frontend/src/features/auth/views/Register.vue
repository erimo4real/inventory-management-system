<template>
  <div class="auth-wrapper">
    <!-- Left Side - Image -->
    <div class="auth-side left-side">
      <div class="side-overlay"></div>
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
          <h1>Join SIMS Today</h1>
          <p>Create your account and start managing your inventory efficiently with our powerful platform.</p>
        </div>
        
        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <span>Track Products & Stock</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <span>Manage Multiple Sites</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span>Secure & Reliable</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="auth-side right-side">
      <div class="auth-form-wrapper">
        <div class="auth-form-container">
          <div class="form-header">
            <h1>Adventure starts here 🚀</h1>
            <p>Make your app management easy and fun!</p>
          </div>

          <div v-if="error" class="alert alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div v-if="success" class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {{ success }}
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Enter password"
                  required
                  minlength="6"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Confirm password"
                  required
                />
                <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group-inline">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="form.terms" required />
                <span class="checkmark"></span>
                <span class="checkbox-label">I agree to <a href="#" class="link">Privacy Policy & Terms</a></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Sign up</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <router-link to="/login" class="link">Sign in instead</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const error = ref('')
    const success = ref('')
    const loading = ref(false)
    
    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    })
    
    const handleSubmit = async () => {
      error.value = ''
      success.value = ''
      
      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Passwords do not match'
        return
      }
      
      if (form.value.password.length < 6) {
        error.value = 'Password must be at least 6 characters'
        return
      }
      
      loading.value = true
      
      try {
        await store.dispatch('auth/register', {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          role: 'staff'
        })
        success.value = 'Account created successfully! Redirecting to login...'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err) {
        error.value = err.response?.data?.error || 'Registration failed. Please try again.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      showPassword,
      showConfirmPassword,
      error,
      success,
      loading,
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

/* Left Side - Image */
.auth-side.left-side {
  flex: 1.2;
  background: url('/images/login-bg.jpg') center/cover no-repeat;
  position: relative;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.side-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(115, 103, 240, 0.9) 0%, rgba(158, 140, 252, 0.85) 100%);
}

.side-content {
  position: relative;
  z-index: 1;
  max-width: 500px;
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
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
}

.side-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
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
  flex: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: #f8f7fa;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 450px;
}

.auth-form-container {
  width: 100%;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 24px;
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
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon > svg:first-child {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
}

.input-with-icon .form-control {
  padding-left: 44px;
  padding-right: 44px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  transition: var(--transition);
}

.toggle-password:hover {
  color: var(--gray-600);
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
  flex-shrink: 0;
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

.checkbox-label .link {
  color: var(--primary-color);
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
}

/* Responsive */
@media (max-width: 992px) {
  .auth-wrapper {
    flex-direction: column;
  }
  
  .auth-side.left-side {
    flex: none;
    padding: 40px;
    min-height: 250px;
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
