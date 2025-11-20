<template>
  <div class="landing-wrapper">
    <div ref="heroSection" class="hero-section">
      <LandingHero ref="heroRef" />
    </div>

    <div ref="featuresSection" class="features-section">
      <LandingFeatures ref="featuresRef" />
    </div>

    <div ref="highlightsSection" class="highlights-section">
      <LandingHighlights ref="highlightsRef" />
    </div>

    <div ref="statsSection" class="stats-section">
      <LandingStats ref="statsRef" />
    </div>

    <div ref="ctaSection" class="cta-section">
      <LandingCta ref="ctaRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingHero from "./components/landing-hero.vue";
import LandingFeatures from "./components/landing-features.vue";
import LandingHighlights from "./components/landing-highlights.vue";
import LandingStats from "./components/landing-stats.vue";
import LandingCta from "./components/landing-cta.vue";

gsap.registerPlugin(ScrollTrigger);

const heroRef = ref<InstanceType<typeof LandingHero>>();
const featuresRef = ref<InstanceType<typeof LandingFeatures>>();
const highlightsRef = ref<InstanceType<typeof LandingHighlights>>();
const statsRef = ref<InstanceType<typeof LandingStats>>();
const ctaRef = ref<InstanceType<typeof LandingCta>>();

const heroSection = ref<HTMLElement>();
const featuresSection = ref<HTMLElement>();
const highlightsSection = ref<HTMLElement>();
const statsSection = ref<HTMLElement>();
const ctaSection = ref<HTMLElement>();

onMounted(() => {
  if (heroRef.value && featuresRef.value && highlightsRef.value && statsRef.value && ctaRef.value) {
    const heroElement = heroRef.value.$el;
    const featuresElement = featuresRef.value.$el;
    const highlightsElement = highlightsRef.value.$el;
    const statsElement = statsRef.value.$el;
    const ctaElement = ctaRef.value.$el;

    const letters = heroElement.querySelectorAll(".letter");
    const featureChars = featuresElement.querySelectorAll(".char");
    const highlightItems = highlightsElement.querySelectorAll(".highlight-item");
    const statItems = statsElement.querySelectorAll(".stat-item");
    const ctaTitle = ctaElement.querySelector(".cta-title");
    const ctaDescription = ctaElement.querySelector(".cta-description");
    const ctaButton = ctaElement.querySelector(".cta-button");

    gsap.set(letters, { opacity: 0, y: 100 });
    gsap.set(featureChars, { opacity: 0, x: -20, rotateZ: -15 });
    gsap.set(highlightItems, { opacity: 0, y: 50 });
    gsap.set(statItems, { opacity: 0, scale: 0.8 });
    gsap.set([ctaTitle, ctaDescription, ctaButton], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(letters, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.7)",
    });

    letters.forEach((letter: Element, index: number) => {
      gsap.fromTo(
        letter,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: -100,
          scrollTrigger: {
            trigger: heroSection.value,
            start: `${20 + index * 15}% top`,
            end: `${40 + index * 15}% top`,
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    gsap.to(featureChars, {
      opacity: 1,
      x: 0,
      rotateZ: 0,
      stagger: 0.02,
      scrollTrigger: {
        trigger: heroSection.value,
        start: "70% top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    gsap.to(highlightItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: highlightsSection.value,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(statItems, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: statsSection.value,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection.value,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    ctaTl
      .to(ctaTitle, { opacity: 1, y: 0, duration: 0.8 })
      .to(ctaDescription, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(ctaButton, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
  }
});
</script>

<style scoped>
.landing-wrapper {
  min-height: 100vh;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.features-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
}

.highlights-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  background-color: rgb(249 250 251);
}

.stats-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
}

.cta-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  background-color: rgb(249 250 251);
}
</style>
