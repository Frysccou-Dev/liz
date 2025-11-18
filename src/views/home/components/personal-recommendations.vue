<template>
  <section class="w-full py-16">
    <div class="flex flex-col px-12 items-center">
      <div class="flex flex-col items-center gap-3 mb-12">
        <h2 class="text-2xl font-light text-gray-900 tracking-wider">Mis Recomendaciones</h2>
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
                  <span v-if="currentAnime.episodes">{{ currentAnime.episodes }} episodios</span>
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
    FINISHED: "Finalizado",
    RELEASING: "Emitiendo",
    NOT_YET_RELEASED: "Por emitir",
    CANCELLED: "Cancelado",
  };
  return translations[status] || status;
};

const animeData = [
  {
    title: "Alya Sometimes Hides Her Feelings in Russian",
    whyRecommended: "Romántica y encantadora, perfecta para disfrutar momentos tiernos",
    description:
      "Alya es una hermosa chica rusa que siempre oculta sus verdaderos sentimientos, mientras que Masachika es un estudiante ordinario que ve a través de su máscara. Una historia de romance llena de momentos adorables.",
    image: new URL("@/assets/recommendations/alya.webp", import.meta.url).href,
  },
  {
    title: "Classroom of the Elite",
    whyRecommended: "Estrategia y psicología, te mantiene pensando",
    description:
      "Una escuela de élite donde los estudiantes son clasificados por habilidad. Ayanokoji, un estudiante excepcional, navega el complejo sistema social mientras revela sus verdaderas capacidades.",
    image: new URL("@/assets/recommendations/cote.jpg", import.meta.url).href,
  },
  {
    title: "Gachiakuta",
    whyRecommended: "Worldbuilding único y personajes memorables",
    description:
      "En un futuro distópico donde los deshechos son descartados en los estratos inferiores, Rudo lucha por encontrar a su amiga. Una aventura épica llena de misterio y acción.",
    image: new URL("@/assets/recommendations/gachiakuta.webp", import.meta.url).href,
  },
  {
    title: "Oshi no Ko",
    whyRecommended: "Thriller psicológico con giros inesperados",
    description:
      "Un idol brillante es asesinada, y su productor renace como su hijo. Una historia de thriller psicológico que te mantiene al borde del asiento con giros inesperados.",
    image: new URL("@/assets/recommendations/oshinoko.webp", import.meta.url).href,
  },
  {
    title: "Takopi's Original Sin",
    whyRecommended: "Oscuro y cautivador, obra maestra subestimada",
    description:
      "Un pulpo extraño aparece en el mundo moderno, buscando encontrar su hogar. Una historia oscura y emotiva que toca temas profundos con un tono único.",
    image: new URL("@/assets/recommendations/takopi.webp", import.meta.url).href,
  },
  {
    title: "Sword Art Online",
    whyRecommended: "Clásico que marcó generación, aventura épica",
    description:
      "Miles de jugadores quedan atrapados en un MMORPG mortal donde morir en el juego significa morir en la vida real. Kirito se convierte en uno de los jugadores más fuertes mientras busca escapar.",
    image: new URL("@/assets/recommendations/sao.webp", import.meta.url).href,
  },
  {
    title: "The Quintessential Quintuplets",
    whyRecommended: "Harem romántico con desarrollo genuino de personajes",
    description:
      "Un tutor es contratado para enseñar a cinco hermanas gemelas idénticas. Lo que comienza como un trabajo se convierte en una aventura romántica llena de sorpresas y desarrollo de personajes.",
    image: new URL("@/assets/recommendations/quinti.webp", import.meta.url).href,
  },
  {
    title: "Frieren: Beyond Journey's End",
    displayTitle: "Frieren: Beyond Journey's End",
    whyRecommended: "Profundo y contemplativo, belleza en la simplicidad",
    description:
      "Después de una épica aventura de 10 años, Frieren una elfa descubre que solo han pasado días para ella. Explora la importancia de los momentos y la conexión entre personas.",
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
