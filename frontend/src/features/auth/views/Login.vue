<template>
  <div class="auth-wrapper">
    <!-- Left Side - Image with Illustrations -->
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
          <h1>Smart Inventory Management</h1>
          <p>Streamline your business operations with our powerful, real-time inventory tracking solution.</p>
        </div>
        
        <!-- Feature Illustrations -->
        <div class="features-grid">
          <!-- Real-time Tracking Chart -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="chart-svg">
                <!-- Chart Background -->
                <rect x="10" y="10" width="100" height="60" rx="4" fill="rgba(255,255,255,0.1)"/>
                <!-- Grid Lines -->
                <line x1="10" y1="30" x2="110" y2="30" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <line x1="10" y1="50" x2="110" y2="50" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <!-- Line Chart -->
                <polyline 
                  points="20,55 35,40 50,48 65,25 80,35 95,20 110,30" 
                  fill="none" 
                  stroke="#28c76f" 
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Data Points -->
                <circle cx="20" cy="55" r="3" fill="#28c76f"/>
                <circle cx="35" cy="40" r="3" fill="#28c76f"/>
                <circle cx="50" cy="48" r="3" fill="#28c76f"/>
                <circle cx="65" cy="25" r="3" fill="#28c76f"/>
                <circle cx="80" cy="35" r="3" fill="#28c76f"/>
                <circle cx="95" cy="20" r="3" fill="#28c76f"/>
                <circle cx="110" cy="30" r="3" fill="#28c76f"/>
                <!-- Animated Pulse -->
                <circle cx="110" cy="30" r="6" fill="none" stroke="#28c76f" stroke-width="2" opacity="0.5">
                  <animate attributeName="r" from="6" to="12" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Real-time Tracking</span>
              <span class="feature-desc">Monitor stock levels live</span>
            </div>
          </div>

          <!-- Multi-user Access -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="users-svg">
                <!-- User Icons -->
                <g transform="translate(10, 15)">
                  <!-- Admin -->
                  <circle cx="30" cy="15" r="12" fill="rgba(115,103,240,0.9)"/>
                  <circle cx="30" cy="12" r="5" fill="white"/>
                  <path d="M22 25 Q30 20 38 25" stroke="white" stroke-width="2" fill="none"/>
                  <rect x="18" y="28" width="24" height="18" rx="3" fill="rgba(115,103,240,0.9)"/>
                  <text x="30" y="40" text-anchor="middle" fill="white" font-size="8" font-weight="600">ADMIN</text>
                </g>
                <g transform="translate(55, 10)">
                  <!-- Manager -->
                  <circle cx="30" cy="18" r="10" fill="rgba(40,199,111,0.8)"/>
                  <circle cx="30" cy="15" r="4" fill="white"/>
                  <path d="M24 26 Q30 22 36 26" stroke="white" stroke-width="2" fill="none"/>
                  <rect x="20" y="29" width="20" height="15" rx="3" fill="rgba(40,199,111,0.8)"/>
                  <text x="30" y="39" text-anchor="middle" fill="white" font-size="7" font-weight="600">MGR</text>
                </g>
                <g transform="translate(85, 18)">
                  <!-- Staff -->
                  <circle cx="22" cy="15" r="8" fill="rgba(0,207,232,0.7)"/>
                  <circle cx="22" cy="13" r="3" fill="white"/>
                  <path d="M17 22 Q22 18 27 22" stroke="white" stroke-width="1.5" fill="none"/>
                </g>
                <!-- Connection Lines -->
                <path d="M42 30 Q60 20 85 33" stroke="rgba(255,255,255,0.4)" stroke-width="1" stroke-dasharray="4,2" fill="none"/>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Team Access</span>
              <span class="feature-desc">Role-based permissions</span>
            </div>
          </div>

          <!-- Reports Chart -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="bar-svg">
                <!-- Background -->
                <rect x="10" y="10" width="100" height="60" rx="4" fill="rgba(255,255,255,0.1)"/>
                <!-- Bar Chart -->
                <rect x="20" y="45" width="12" height="20" rx="2" fill="#7367f0">
                  <animate attributeName="height" from="0" to="20" dur="1s" fill="freeze"/>
                  <animate attributeName="y" from="65" to="45" dur="1s" fill="freeze"/>
                </rect>
                <rect x="38" y="35" width="12" height="30" rx="2" fill="#28c76f">
                  <animate attributeName="height" from="0" to="30" dur="1s" begin="0.2s" fill="freeze"/>
                  <animate attributeName="y" from="65" to="35" dur="1s" begin="0.2s" fill="freeze"/>
                </rect>
                <rect x="56" y="40" width="12" height="25" rx="2" fill="#ff9f43">
                  <animate attributeName="height" from="0" to="25" dur="1s" begin="0.4s" fill="freeze"/>
                  <animate attributeName="y" from="65" to="40" dur="1s" begin="0.4s" fill="freeze"/>
                </rect>
                <rect x="74" y="25" width="12" height="40" rx="2" fill="#00cfe8">
                  <animate attributeName="height" from="0" to="40" dur="1s" begin="0.6s" fill="freeze"/>
                  <animate attributeName="y" from="65" to="25" dur="1s" begin="0.6s" fill="freeze"/>
                </rect>
                <rect x="92" y="30" width="12" height="35" rx="2" fill="#ea5455">
                  <animate attributeName="height" from="0" to="35" dur="1s" begin="0.8s" fill="freeze"/>
                  <animate attributeName="y" from="65" to="30" dur="1s" begin="0.8s" fill="freeze"/>
                </rect>
                <!-- Trend Line -->
                <polyline 
                  points="26,50 44,42 62,46 80,35 98,38" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.6)" 
                  stroke-width="2"
                  stroke-dasharray="4,2"
                />
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Analytics</span>
              <span class="feature-desc">Visual reports & insights</span>
            </div>
          </div>

          <!-- Inventory Donut Chart -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="donut-svg">
                <!-- Donut Chart -->
                <circle cx="40" cy="40" r="25" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10"/>
                <circle cx="40" cy="40" r="25" fill="none" stroke="#7367f0" stroke-width="10" 
                  stroke-dasharray="50 110" stroke-dashoffset="0" transform="rotate(-90 40 40)"/>
                <circle cx="40" cy="40" r="25" fill="none" stroke="#28c76f" stroke-width="10" 
                  stroke-dasharray="30 110" stroke-dashoffset="-50" transform="rotate(-90 40 40)"/>
                <circle cx="40" cy="40" r="25" fill="none" stroke="#ff9f43" stroke-width="10" 
                  stroke-dasharray="20 110" stroke-dashoffset="-80" transform="rotate(-90 40 40)"/>
                <circle cx="40" cy="40" r="25" fill="none" stroke="#00cfe8" stroke-width="10" 
                  stroke-dasharray="15 110" stroke-dashoffset="-100" transform="rotate(-90 40 40)"/>
                <!-- Center Text -->
                <text x="40" y="38" text-anchor="middle" fill="white" font-size="12" font-weight="700">85%</text>
                <text x="40" y="50" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="6">FILLED</text>
                
                <!-- Legend -->
                <g transform="translate(75, 15)">
                  <rect x="0" y="0" width="8" height="8" rx="2" fill="#7367f0"/>
                  <text x="12" y="7" fill="white" font-size="6">Electronics</text>
                  <rect x="0" y="14" width="8" height="8" rx="2" fill="#28c76f"/>
                  <text x="12" y="21" fill="white" font-size="6">Furniture</text>
                  <rect x="0" y="28" width="8" height="8" rx="2" fill="#ff9f43"/>
                  <text x="12" y="35" fill="white" font-size="6">Office</text>
                  <rect x="0" y="42" width="8" height="8" rx="2" fill="#00cfe8"/>
                  <text x="12" y="49" fill="white" font-size="6">Other</text>
                </g>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Inventory</span>
              <span class="feature-desc">Stock distribution</span>
            </div>
          </div>
        </div>
      </div>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
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
              <div class="label-row">
                <label class="form-label">Password</label>
                <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
              </div>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <p>New on our platform? <router-link to="/register" class="link">Create an account</router-link></p>
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
  background: linear-gradient(135deg, rgba(115, 103, 240, 0.92) 0%, rgba(158, 140, 252, 0.88) 100%);
}

.side-content {
  position: relative;
  z-index: 1;
  max-width: 520px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.brand-name {
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.side-text {
  margin-bottom: 40px;
}

.side-text h1 {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  line-height: 1.2;
}

.side-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-illustration {
  margin-bottom: 12px;
}

.feature-illustration svg {
  width: 100%;
  height: auto;
}

.feature-label {
  text-align: center;
}

.feature-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

/* Right Side - Form */
.auth-side.right-side {
  flex: 0.8;
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
  margin-bottom: 24px;
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
    flex: none;
    padding: 40px;
    min-height: auto;
  }
  
  .side-text h1 {
    font-size: 28px;
  }
  
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  .feature-card {
    padding: 12px;
  }
  
  .brand-logo {
    margin-bottom: 24px;
  }
  
  .side-text {
    margin-bottom: 24px;
  }
  
  .auth-side.right-side {
    padding: 40px 24px;
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
