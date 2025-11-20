<template>
  <div class="cta-container">
    <h2 class="cta-title">Ready to start?</h2>
    <p class="cta-description">Begin your anime journey today</p>
    <router-link to="/home" class="cta-button">
      <span class="cta-button-text">Get Started</span>
      <span class="cta-arrow">→</span>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.cta-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  padding: 0 2rem;
}

.cta-title {
  font-size: 3rem;
  font-weight: 300;
  color: rgb(17 24 39);
  margin: 0;
  letter-spacing: -0.025em;
}

.cta-description {
  font-size: 1.125rem;
  font-weight: 300;
  color: rgb(107 114 128);
  margin: 0;
  letter-spacing: 0.025em;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 2.5rem;
  background-color: rgb(17 24 39);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: rgb(31 41 55);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.cta-button-text {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.025em;
}

.cta-arrow {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 2rem;
  }

  .cta-description {
    font-size: 1rem;
  }

  .cta-button {
    padding: 0.875rem 2rem;
  }
}
</style>
