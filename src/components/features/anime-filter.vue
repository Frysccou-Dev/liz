<template>
  <div class="w-full flex justify-center px-4 mb-12 relative z-30">
    <div class="w-[min(1100px,100%)]">
      <div
        class="bg-white/6 backdrop-blur-md border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search anime..."
              class="w-full h-12 px-4 pl-11 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all text-gray-700 placeholder:text-gray-400"
              @keyup.enter="emitSearch"
            />
            <SearchIcon class="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          <div class="flex gap-2">
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="h-12 w-12 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"
              title="Clear filters"
            >
              <Trash2Icon class="w-5 h-5" />
            </button>
            <button
              @click="emitSearch"
              class="h-12 px-8 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium tracking-wide shadow-lg shadow-gray-900/20 active:scale-95 transform duration-200 flex items-center justify-center gap-2"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CustomSelect
            v-model="filters.genre"
            :options="genreOptions"
            placeholder="Genre"
            multiple
          />

          <CustomSelect v-model="filters.year" :options="yearOptions" placeholder="Year" />

          <CustomSelect v-model="filters.season" :options="seasonOptions" placeholder="Season" />

          <CustomSelect
            v-model="filters.format"
            :options="formatOptions"
            placeholder="Format"
            multiple
          />

          <CustomSelect v-model="filters.status" :options="statusOptions" placeholder="Status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { Search as SearchIcon, Trash2 as Trash2Icon } from "lucide-vue-next";
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

const hasActiveFilters = computed(() => {
  return (
    (filters.search && filters.search.trim() !== "") ||
    (filters.genre && filters.genre.length > 0) ||
    filters.year !== undefined ||
    filters.season !== undefined ||
    (filters.format && filters.format.length > 0) ||
    filters.status !== undefined
  );
});

const currentYear = new Date().getFullYear() + 1;
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const genreOptions = computed(() => genres.value.map((g) => ({ label: g, value: g })));

const yearOptions = computed(() => years.map((y) => ({ label: y.toString(), value: y })));

const seasonOptions = [
  { label: "Winter", value: "WINTER" },
  { label: "Spring", value: "SPRING" },
  { label: "Summer", value: "SUMMER" },
  { label: "Fall", value: "FALL" },
];

const formatOptions = [
  { label: "TV", value: "TV" },
  { label: "Movie", value: "MOVIE" },
  { label: "OVA", value: "OVA" },
  { label: "ONA", value: "ONA" },
  { label: "Special", value: "SPECIAL" },
];

const statusOptions = [
  { label: "Airing", value: "RELEASING" },
  { label: "Finished", value: "FINISHED" },
  { label: "Not Yet Aired", value: "NOT_YET_RELEASED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const emitSearch = () => {
  emit("search", { ...filters });
};

const clearFilters = () => {
  filters.search = "";
  filters.genre = [];
  filters.year = undefined;
  filters.season = undefined;
  filters.format = [];
  filters.status = undefined;
  emitSearch();
};

onMounted(async () => {
  try {
    genres.value = await aniListService.getGenres();
  } catch (error) {
    console.error("Failed to fetch genres:", error);
  }
});
</script>
