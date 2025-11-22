<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end">
    <div
      v-if="isOpen"
      class="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm h-[500px] flex flex-col overflow-hidden mb-4 animate-slide-up border border-gray-200"
    >
      <div class="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200"
          >
            <span class="text-xl">🌸</span>
          </div>
          <div>
            <h3 class="text-gray-900 font-medium">Lizbeth</h3>
            <p class="text-xs text-gray-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Online
            </p>
          </div>
        </div>
        <button @click="closeChat" class="text-gray-400 hover:text-gray-900 transition-colors">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex flex-col gap-1"
          :class="msg.isUser ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed"
            :class="
              msg.isUser
                ? 'bg-gray-900 text-white rounded-tr-none'
                : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
            "
          >
            <p v-if="msg.text">{{ msg.text }}</p>

            <div
              v-if="msg.recommendation"
              class="mt-2 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div class="aspect-video relative">
                <img
                  :src="msg.recommendation.coverImage.large"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-3"
                >
                  <h4 class="text-white font-bold text-sm line-clamp-1">
                    {{ msg.recommendation.title.romaji }}
                  </h4>
                </div>
              </div>
              <div class="p-3">
                <p class="text-xs text-gray-600 line-clamp-3 mb-2">{{ msg.reason }}</p>
                <router-link
                  :to="`/${msg.type?.toLowerCase() || 'anime'}/${msg.recommendation.id}`"
                  class="block w-full py-1.5 bg-gray-900 text-white text-center text-xs rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isTyping" class="flex items-center gap-1 ml-2">
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></span>
        </div>
      </div>

      <div class="p-4 bg-white border-t border-gray-100">
        <div v-if="currentOptions.length > 0" class="flex flex-wrap gap-2 mb-2">
          <button
            v-for="option in currentOptions"
            :key="option.value"
            @click="handleOption(option)"
            class="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {{ option.label }}
          </button>
        </div>

        <div v-else-if="showTextInput" class="flex gap-2">
          <input
            v-model="userInput"
            type="text"
            placeholder="Tell me more..."
            maxlength="250"
            class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
            @keyup.enter="handleTextSubmit"
          />
          <button
            @click="handleTextSubmit"
            class="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            :disabled="!userInput.trim()"
          >
            <SendIcon class="w-4 h-4" />
          </button>
        </div>

        <div v-else-if="isFinished" class="text-center">
          <button @click="resetChat" class="text-xs text-gray-400 hover:text-gray-600 underline">
            Start a new conversation
          </button>
        </div>
      </div>
    </div>

    <button
      v-else
      @click="openChat"
      class="w-14 h-14 bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform group relative"
    >
      <span class="text-2xl group-hover:scale-110 transition-transform">🌸</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { X as XIcon, Send as SendIcon } from "lucide-vue-next";
import { aniListService, type Anime } from "@/services/anilist";
import { aniListMangaService, type Manga } from "@/services/anilist-manga";

interface Message {
  text?: string;
  isUser: boolean;
  recommendation?: Anime | Manga;
  type?: "ANIME" | "MANGA";
  reason?: string;
}

interface Option {
  label: string;
  value: string;
  nextStep?: string;
}

const isOpen = ref(false);
const messages = ref<Message[]>([]);
const isTyping = ref(false);
const userInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const step = ref("GREETING");
const preferences = ref({
  type: "",
  genre: "",
  details: "",
});

const currentOptions = ref<Option[]>([]);
const showTextInput = ref(false);
const isFinished = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const addMessage = async (text: string, isUser = false) => {
  messages.value.push({ text, isUser });
  await scrollToBottom();
};

const simulateTyping = async (duration = 1000) => {
  isTyping.value = true;
  await scrollToBottom();
  await new Promise((resolve) => setTimeout(resolve, duration));
  isTyping.value = false;
};

const openChat = async () => {
  isOpen.value = true;
  if (messages.value.length === 0) {
    await simulateTyping();
    addMessage("Hi there! 🌸 I'm Lizbeth. Ready to find your next obsession? 🖤");
    setOptionsForStep("GREETING");
  }
};

const closeChat = () => {
  isOpen.value = false;
};

const resetChat = () => {
  messages.value = [];
  step.value = "GREETING";
  preferences.value = { type: "", genre: "", details: "" };
  isFinished.value = false;
  openChat();
};

const setOptionsForStep = (currentStep: string) => {
  showTextInput.value = false;
  switch (currentStep) {
    case "GREETING":
      currentOptions.value = [
        { label: "Hi Lizbeth! 👋", value: "hi", nextStep: "TYPE_SELECT" },
        { label: "Recommend me something! ✨", value: "recommend", nextStep: "TYPE_SELECT" },
      ];
      break;
    case "TYPE_SELECT":
      currentOptions.value = [
        { label: "Anime 📺", value: "ANIME", nextStep: "GENRE_SELECT" },
        { label: "Manga 📖", value: "MANGA", nextStep: "GENRE_SELECT" },
      ];
      break;
    case "GENRE_SELECT":
      currentOptions.value = [
        { label: "Action ⚔️", value: "Action", nextStep: "DETAILS" },
        { label: "Romance 💝", value: "Romance", nextStep: "DETAILS" },
        { label: "Fantasy 🧚", value: "Fantasy", nextStep: "DETAILS" },
        { label: "Sci-Fi 🤖", value: "Sci-Fi", nextStep: "DETAILS" },
        { label: "Slice of Life 🍰", value: "Slice of Life", nextStep: "DETAILS" },
      ];
      break;
    case "DETAILS":
      currentOptions.value = [];
      showTextInput.value = true;
      break;
  }
};

const handleOption = async (option: Option) => {
  addMessage(option.label, true);
  currentOptions.value = [];

  if (step.value === "TYPE_SELECT") {
    preferences.value.type = option.value;
  } else if (step.value === "GENRE_SELECT") {
    preferences.value.genre = option.value;
  }

  await simulateTyping(800);

  if (option.nextStep) {
    step.value = option.nextStep;

    if (step.value === "TYPE_SELECT") {
      addMessage("Ooh, exciting! 🖤 Do you prefer Anime or Manga today? 🌸");
    } else if (step.value === "GENRE_SELECT") {
      addMessage(
        `Nice choice! What kind of ${preferences.value.type.toLowerCase()} are you in the mood for?`
      );
    } else if (step.value === "DETAILS") {
      addMessage("Tell me a bit more about what you like! 🖤 (max 250 chars)");
    }

    setOptionsForStep(step.value);
  }
};

const handleTextSubmit = async () => {
  if (!userInput.value.trim()) return;

  const text = userInput.value;
  preferences.value.details = text;
  addMessage(text, true);
  userInput.value = "";
  showTextInput.value = false;

  await simulateTyping(1500);
  addMessage("Let me think... 🌸🖤");
  await simulateTyping(1500);

  await fetchRecommendation();
};

const fetchRecommendation = async () => {
  try {
    let result;
    if (preferences.value.type === "ANIME") {
      let results = await aniListService.searchAdvanced(
        {
          search: preferences.value.details || undefined,
          genre: [preferences.value.genre],
          status: "FINISHED",
        },
        1,
        5
      );

      if (results.length === 0) {
        results = await aniListService.searchAdvanced(
          {
            genre: [preferences.value.genre],
            status: "FINISHED",
          },
          1,
          20
        );
        if (results.length > 0) {
          results = results.sort(() => 0.5 - Math.random());
        }
      }

      if (results.length > 0) {
        const bestMatch = results[0];
        if (bestMatch) {
          result = await aniListService.getAnimeById(bestMatch.id);
        }
      }
    } else {
      let results = await aniListMangaService.searchAdvanced(
        {
          search: preferences.value.details || undefined,
          genre: [preferences.value.genre],
          status: "FINISHED",
        },
        1,
        5
      );

      if (results.length === 0) {
        results = await aniListMangaService.searchAdvanced(
          {
            genre: [preferences.value.genre],
            status: "FINISHED",
          },
          1,
          20
        );
        if (results.length > 0) {
          results = results.sort(() => 0.5 - Math.random());
        }
      }

      if (results.length > 0) {
        const bestMatch = results[0];
        if (bestMatch) {
          result = await aniListMangaService.getMangaById(bestMatch.id);
        }
      }
    }

    if (result) {
      const reasons = [
        `Because you like ${preferences.value.genre}, this is a must-watch! 🖤 It has everything you're looking for.`,
        `I absolutely love this one! 🌸 The story fits your vibe perfectly.`,
        `Trust me on this, it's a hidden gem that matches your taste! 🖤`,
        `Since you mentioned "${preferences.value.details.substring(
          0,
          10
        )}...", this came to mind immediately! 🌸`,
      ];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];

      messages.value.push({
        isUser: false,
        recommendation: result,
        type: preferences.value.type as "ANIME" | "MANGA",
        reason: reason,
      });
      await scrollToBottom();

      await simulateTyping(1000);
      addMessage("Hope you like it! 🌸 Want to try again?");
      isFinished.value = true;
    } else {
      addMessage("Oh no! I couldn't find the perfect match right now. 😿 Try again?");
      isFinished.value = true;
    }
  } catch {
    addMessage("My connection to the anime world is a bit fuzzy... 😿 Try again later.");
    isFinished.value = true;
  }
};
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
