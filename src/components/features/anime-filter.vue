<template>
  <div class="w-full flex justify-center px-4 mb-12">
    <div class="w-[min(1100px,100%)]">
      <div
        class="bg-white/6 backdrop-blur-md border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar anime..."
              class="w-full h-12 px-4 pl-11 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all text-gray-700 placeholder:text-gray-400"
              @keyup.enter="emitSearch"
            />
            <SearchIcon class="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            @click="emitSearch"
            class="h-12 px-8 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium tracking-wide shadow-lg shadow-gray-900/20 active:scale-95 transform duration-200 flex items-center justify-center gap-2"
          >
            <span>Buscar</span>
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CustomSelect
            v-model="filters.genre"
            :options="genreOptions"
            placeholder="Género"
            multiple
          />

          <CustomSelect v-model="filters.year" :options="yearOptions" placeholder="Año" />

          <CustomSelect v-model="filters.season" :options="seasonOptions" placeholder="Temporada" />

          <CustomSelect
            v-model="filters.format"
            :options="formatOptions"
            placeholder="Formato"
            multiple
          />

          <CustomSelect v-model="filters.status" :options="statusOptions" placeholder="Estado" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { Search as SearchIcon } from "lucide-vue-next";
import { type SearchFilters, aniListService } from "@/services/anilist";
import CustomSelect from "@/components/ui/custom-select.vue";

const emit = defineEmits<{
  search: [filters: SearchFilters];
}>();

const filters = reactive<SearchFilters>({
  search: "",
  genre: [],
  year: undefined,
  season: undefined,
  format: [],
  status: undefined,
});

const genres = ref<string[]>([]);

const currentYear = new Date().getFullYear() + 1;
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const genreOptions = computed(() => genres.value.map((g) => ({ label: g, value: g })));

const yearOptions = computed(() => years.map((y) => ({ label: y.toString(), value: y })));

const seasonOptions = [
  { label: "Invierno", value: "WINTER" },
  { label: "Primavera", value: "SPRING" },
  { label: "Verano", value: "SUMMER" },
  { label: "Otoño", value: "FALL" },
];

const formatOptions = [
  { label: "TV", value: "TV" },
  { label: "Película", value: "MOVIE" },
  { label: "OVA", value: "OVA" },
  { label: "ONA", value: "ONA" },
  { label: "Especial", value: "SPECIAL" },
];

const statusOptions = [
  { label: "En Emisión", value: "RELEASING" },
  { label: "Finalizado", value: "FINISHED" },
  { label: "Próximamente", value: "NOT_YET_RELEASED" },
  { label: "Cancelado", value: "CANCELLED" },
];

const emitSearch = () => {
  emit("search", { ...filters });
};

onMounted(async () => {
  try {
    genres.value = await aniListService.getGenres();
  } catch (error) {
    console.error("Failed to fetch genres:", error);
  }
});
</script>
