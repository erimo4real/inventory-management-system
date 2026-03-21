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
          <h1>Reset Your Password</h1>
          <p>Don't worry, we'll send you an email with instructions to reset your password.</p>
        </div>
        
        <!-- Feature Illustrations -->
        <div class="features-grid">
          <!-- Security Lock -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="lock-svg">
                <circle cx="60" cy="40" r="30" fill="rgba(255,255,255,0.1)"/>
                <rect x="45" y="35" width="30" height="25" rx="4" fill="rgba(255,255,255,0.2)"/>
                <path d="M50 35 V25 A10 10 0 0 1 70 25 V35" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="60" cy="47" r="5" fill="white"/>
                <rect x="58" y="47" width="4" height="8" rx="2" fill="white"/>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Secure Access</span>
              <span class="feature-desc">Protected by encryption</span>
            </div>
          </div>

          <!-- Email Send -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="email-svg">
                <rect x="20" y="15" width="80" height="50" rx="4" fill="rgba(255,255,255,0.1)"/>
                <polyline points="20,15 60,40 100,15" stroke="white" stroke-width="2" fill="none"/>
                <polyline points="20,65 40,45 60,55" stroke="#28c76f" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
                <circle cx="95" cy="20" r="15" fill="#28c76f">
                  <animate attributeName="opacity" from="1" to="0.3" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <polyline points="89,20 94,25 101,15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Quick Recovery</span>
              <span class="feature-desc">Instant email delivery</span>
            </div>
          </div>

          <!-- Shield Protection -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="shield-svg">
                <path d="M60 10 L100 25 V45 C100 60 60 75 60 75 C60 75 20 60 20 45 V25 L60 10Z" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="2"/>
                <polyline points="45,40 55,50 75,30" stroke="#28c76f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Account Safety</span>
              <span class="feature-desc">Verified recovery process</span>
            </div>
          </div>

          <!-- Clock Timer -->
          <div class="feature-card">
            <div class="feature-illustration">
              <svg viewBox="0 0 120 80" class="clock-svg">
                <circle cx="60" cy="40" r="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <line x1="60" y1="40" x2="60" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="60" y1="40" x2="72" y2="40" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <circle cx="60" cy="40" r="3" fill="white"/>
                <text x="60" y="70" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">Link expires in 24h</text>
              </svg>
            </div>
            <div class="feature-label">
              <span class="feature-title">Time-Sensitive</span>
              <span class="feature-desc">Links expire for security</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Forgot Password Form -->
    <div class="auth-side right-side">
      <div class="auth-form-wrapper">
        <div class="auth-form-container">
          <div class="form-header">
            <div class="form-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1>Forgot Password? 🔒</h1>
            <p>Enter your email and we'll send you a link to reset your password</p>
          </div>

          <div v-if="error" class="alert alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div v-if="emailSent" class="success-state">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Mail sent! ✉️</h3>
            <p>We've sent an email to <strong>{{ form.email }}</strong> with instructions to reset your password.</p>
            <button @click="resetForm" class="btn btn-outline">Didn't receive the email? Resend</button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="auth-form">
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

            <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Send Reset Link</span>
            </button>
          </form>

          <div class="auth-footer">
            <router-link to="/login" class="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to login
            </router-link>
          </div>
        </div>
      </div>
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
    const error = ref('')
    const emailSent = ref(false)

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      try {
        await authAPI.forgotPassword(form.value.email)
        emailSent.value = true
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to send reset link. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      emailSent.value = false
      error.value = ''
    }

    return { form, loading, error, emailSent, handleSubmit, resetForm }
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
  background: url('/images/forgot-bg.jpg') center/cover no-repeat;
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
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 40px;
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
  background: #f8f7fa;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-form-container {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-icon {
  width: 80px;
  height: 80px;
  background: rgba(115, 103, 240, 0.1);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
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
  margin-bottom: 24px;
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
  margin-top: 24px;
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

/* Success State */
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

.success-state strong {
  color: var(--gray-800);
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
  
  .brand-logo {
    margin-bottom: 24px;
  }
  
  .side-text {
    margin-bottom: 24px;
  }
  
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 24px;
  }
  
  .feature-card {
    padding: 12px;
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
