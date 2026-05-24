<template>
  <div class="loading-screen">
    <div class="loader">
      <div class="logo-blink">SIMS</div>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen'
}
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader {
  text-align: center;
}

.logo-blink {
  font-size: 72px;
  font-weight: 800;
  color: #4f46e5;
  animation: blink 1.5s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
  margin-bottom: 40px;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.loading-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 0 auto 20px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #818cf8);
  border-radius: 2px;
  animation: progress 1.5s ease-in-out infinite;
}

@keyframes progress {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 60%;
    margin-left: 20%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}

.loading-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
</style>
