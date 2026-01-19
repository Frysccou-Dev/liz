<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div
      class="bg-white rounded-2xl w-full max-w-lg relative z-10 overflow-hidden animate-scale-in"
    >
      <div class="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 class="font-bold text-gray-900">Create Post</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-900">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-4">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="w-full text-lg font-bold placeholder-gray-400 border-none focus:ring-0 p-0 mb-4"
        />
        <textarea
          v-model="content"
          placeholder="What's happening?"
          class="w-full h-32 resize-none border-none focus:ring-0 p-0 text-gray-700 placeholder-gray-400 text-base"
        ></textarea>

        <div v-if="attachments.length > 0" class="grid grid-cols-2 gap-2 mb-4">
          <div
            v-for="(att, idx) in attachments"
            :key="att.id"
            class="relative aspect-video rounded-lg overflow-hidden group bg-gray-100"
            :class="{ 'border-2 border-red-500': att.error }"
          >
            <img
              :src="att.previewUrl"
              class="w-full h-full object-cover"
              :class="{ 'opacity-50': att.uploading }"
            />

            <div v-if="att.uploading" class="absolute inset-0 flex items-center justify-center">
              <LoaderIcon class="w-6 h-6 text-gray-900 animate-spin" />
            </div>

            <button
              @click="removeAttachment(idx)"
              class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XIcon class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex gap-2">
            <label
              class="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': attachments.length >= 4 }"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                multiple
                class="hidden"
                @change="handleImageUpload"
                :disabled="attachments.length >= 4"
              />
              <ImageIcon class="w-5 h-5" />
            </label>
          </div>
          <button
            @click="submit"
            class="px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            :disabled="!isValid || loading"
          >
            {{ loading ? "Posting..." : "Post" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { X as XIcon, Image as ImageIcon, Loader2 as LoaderIcon } from "lucide-vue-next";
import { uploadImage } from "@/services/cloudinary";
import { socialService } from "@/services/social";

interface Attachment {
  id: string;
  file: File;
  previewUrl: string;
  cloudinaryUrl?: string;
  uploading: boolean;
  error: boolean;
}

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const title = ref("");
const content = ref("");
const attachments = ref<Attachment[]>([]);
const loading = ref(false);

const isValid = computed(() => {
  const hasTitle = title.value.trim().length > 0;
  const hasContent = content.value.trim().length > 0;
  const isUploading = attachments.value.some((a) => a.uploading);
  const hasErrors = attachments.value.some((a) => a.error);
  return hasTitle && hasContent && !isUploading && !hasErrors;
});

const validateFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    alert("Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("File size too large. Max 5MB.");
    return false;
  }
  return true;
};

const handleImageUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;

  const remainingSlots = 4 - attachments.value.length;
  const filesToProcess = Array.from(files).slice(0, remainingSlots);

  for (const file of filesToProcess) {
    if (!validateFile(file)) continue;

    const id = Math.random().toString(36).substring(7);
    const previewUrl = URL.createObjectURL(file);

    const attachment: Attachment = {
      id,
      file,
      previewUrl,
      uploading: true,
      error: false,
    };

    attachments.value.push(attachment);

    uploadImage(file)
      .then((url) => {
        attachment.cloudinaryUrl = url;
        attachment.uploading = false;
      })
      .catch(() => {
        attachment.error = true;
        attachment.uploading = false;
        alert("Failed to upload image. Please check your connection or try again.");
      });
  }

  input.value = "";
};

const removeAttachment = (index: number) => {
  const attachment = attachments.value[index];
  if (attachment) {
    URL.revokeObjectURL(attachment.previewUrl);
    attachments.value.splice(index, 1);
  }
};

const submit = async () => {
  if (!isValid.value) return;

  loading.value = true;
  try {
    const imageUrls = attachments.value
      .map((a) => a.cloudinaryUrl)
      .filter((url): url is string => !!url);

    await socialService.createPost(title.value, content.value, imageUrls);
    emit("created");
    emit("close");
  } catch {
    alert("Failed to create post. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
