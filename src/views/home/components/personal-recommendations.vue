<template>
  <section class="w-full py-16">
    <div class="flex flex-col px-12 items-center">
      <div class="flex flex-col items-center gap-3 mb-12">
        <h2 class="text-2xl font-light text-gray-900 tracking-wider">My Recommendations</h2>
        <div class="w-16 h-px bg-linear-to-r from-transparent via-gray-900 to-transparent"></div>
      </div>

      <div class="w-full max-w-4xl">
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="(anime, index) in recommendedAnimes"
            :key="anime.id"
            @click="selectedIndex = index"
            class="px-4 py-2 text-sm font-light transition-all duration-300"
            :class="{
              'text-gray-900 border-b-2 border-gray-900': selectedIndex === index,
              'text-gray-500 border-b border-gray-300 hover:text-gray-700': selectedIndex !== index,
            }"
          >
            {{ anime.title }}
          </button>
        </div>

        <Transition name="fade-slide" mode="out-in">
          <div
            v-if="currentAnime"
            :key="currentAnime.id"
            class="flex flex-col md:flex-row gap-8 items-start"
          >
            <div class="w-full md:w-2/5 shrink-0">
              <div class="relative rounded-lg overflow-hidden shadow-lg aspect-3/4">
                <img
                  :src="currentAnime.coverImage"
                  :alt="currentAnime.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <div class="w-full md:w-3/5 flex flex-col gap-4">
              <div>
                <h3 class="text-xl font-light text-gray-900 mb-2">{{ currentAnime.title }}</h3>
                <div class="flex gap-4 text-sm text-gray-600">
                  <span v-if="currentAnime.episodes">{{ currentAnime.episodes }} episodes</span>
                  <span v-if="currentAnime.status">{{ translateStatus(currentAnime.status) }}</span>
                </div>
              </div>

              <p
                v-if="currentAnime.description"
                class="text-sm text-gray-700 font-light leading-relaxed line-clamp-6"
              >
                {{ currentAnime.description }}
              </p>

              <div v-if="currentAnime.whyRecommended" class="pt-4 border-t border-gray-200">
                <p class="text-sm font-light text-gray-900 italic">
                  "{{ currentAnime.whyRecommended }}"
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { aniListService } from "@/services/anilist";

interface RecommendedAnime {
  id: number;
  title: string;
  coverImage: string;
  description?: string;
  episodes?: number;
  status?: string;
  whyRecommended?: string;
}

const recommendedAnimes = ref<RecommendedAnime[]>([]);
const selectedIndex = ref(0);
const emit = defineEmits<{ loaded: [] }>();

const currentAnime = computed(() => recommendedAnimes.value[selectedIndex.value] || null);

const translateStatus = (status: string): string => {
  const translations: { [key: string]: string } = {
    FINISHED: "Finished",
    RELEASING: "Airing",
    NOT_YET_RELEASED: "Not Yet Aired",
    CANCELLED: "Cancelled",
  };
  return translations[status] || status;
};

const animeData = [
  {
    title: "Alya Sometimes Hides Her Feelings in Russian",
    whyRecommended: "Romantic and charming, perfect for enjoying tender moments",
    description:
      "Alya is a beautiful Russian girl who always hides her true feelings, while Masachika is an ordinary student who sees through her mask. A romance story full of adorable moments.",
    image: new URL("@/assets/recommendations/alya.webp", import.meta.url).href,
  },
  {
    title: "Classroom of the Elite",
    whyRecommended: "Strategy and psychology, keeps you thinking",
    description:
      "An elite school where students are ranked by ability. Ayanokoji, an exceptional student, navigates the complex social system while revealing his true capabilities.",
    image: new URL("@/assets/recommendations/cote.jpg", import.meta.url).href,
  },
  {
    title: "Gachiakuta",
    whyRecommended: "Unique worldbuilding and memorable characters",
    description:
      "In a dystopian future where waste is discarded in lower strata, Rudo fights to find his friend. An epic adventure full of mystery and action.",
    image: new URL("@/assets/recommendations/gachiakuta.webp", import.meta.url).href,
  },
  {
    title: "Oshi no Ko",
    whyRecommended: "Psychological thriller with unexpected twists",
    description:
      "A brilliant idol is murdered, and her producer is reborn as her son. A psychological thriller story that keeps you on the edge of your seat with unexpected twists.",
    image: new URL("@/assets/recommendations/oshinoko.webp", import.meta.url).href,
  },
  {
    title: "Takopi's Original Sin",
    whyRecommended: "Dark and captivating, underrated masterpiece",
    description:
      "A strange octopus appears in the modern world, seeking to find its home. A dark and emotional story that touches deep themes with a unique tone.",
    image: new URL("@/assets/recommendations/takopi.webp", import.meta.url).href,
  },
  {
    title: "Sword Art Online",
    whyRecommended: "Classic that marked a generation, epic adventure",
    description:
      "Thousands of players are trapped in a deadly MMORPG where dying in the game means dying in real life. Kirito becomes one of the strongest players while seeking to escape.",
    image: new URL("@/assets/recommendations/sao.webp", import.meta.url).href,
  },
  {
    title: "The Quintessential Quintuplets",
    whyRecommended: "Romantic harem with genuine character development",
    description:
      "A tutor is hired to teach five identical twin sisters. What begins as a job becomes a romantic adventure full of surprises and character development.",
    image: new URL("@/assets/recommendations/quinti.webp", import.meta.url).href,
  },
  {
    title: "Frieren: Beyond Journey's End",
    displayTitle: "Frieren: Beyond Journey's End",
    whyRecommended: "Deep and contemplative, beauty in simplicity",
    description:
      "After an epic 10-year adventure, Frieren an elf discovers that only days have passed for her. Explores the importance of moments and connections between people.",
    image: new URL("@/assets/recommendations/frieren.webp", import.meta.url).href,
  },
];

onMounted(async () => {
  try {
    const results = await Promise.all(
      animeData.map((anime) => aniListService.searchAnime(anime.title, 1))
    );

    recommendedAnimes.value = results
      .filter((result) => result && result.length > 0)
      .flatMap((result, index) => {
        if (!result || !result[0]) return [];
        const anime = result[0];
        const customData = animeData[index];
        return [
          {
            id: anime.id,
            title: customData?.displayTitle || anime.title.english || anime.title.romaji,
            coverImage: customData?.image || "",
            description: customData?.description || "",
            episodes: anime.episodes,
            status: anime.status,
            whyRecommended: customData?.whyRecommended,
          },
        ];
      });
    emit("loaded");
  } catch (error) {
    console.error("Error fetching recommended anime:", error);
    emit("loaded");
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
