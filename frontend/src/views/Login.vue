<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>SIMS</h1>
        <p>Smart Inventory Management System</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            placeholder="Enter your password"
          />
        </div>
        
        <div v-if="isRegistering" class="form-group">
          <label>Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="Enter your name"
          />
        </div>
        
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>{{ isRegistering ? 'Register' : 'Login' }}</span>
        </button>
        
        <div v-if="!isRegistering" class="forgot-password">
          <router-link to="/forgot-password">Forgot Password?</router-link>
        </div>
      </form>
      
      <div class="toggle-mode">
        <span v-if="isRegistering">
          Already have an account? 
          <a @click="toggleMode">Login</a>
        </span>
        <span v-else>
          Don't have an account? 
          <a @click="toggleMode">Register</a>
        </span>
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
    
    const isRegistering = ref(false)
    const form = ref({
      email: '',
      password: '',
      name: ''
    })
    
    const loading = computed(() => store.getters['auth/authLoading'])
    const error = computed(() => store.getters['auth/authError'])
    
    const toggleMode = () => {
      isRegistering.value = !isRegistering.value
      store.commit('auth/SET_ERROR', null)
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
      loading,
      error,
      toggleMode,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 8px;
}

.login-header p {
  color: #6b7280;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

.submit-btn {
  padding: 14px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #4338ca;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
}

.toggle-mode a {
  color: #4f46e5;
  cursor: pointer;
  font-weight: 500;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

.forgot-password {
  text-align: center;
  margin-top: 12px;
}

.forgot-password a {
  color: #4f46e5;
  font-size: 14px;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
