<script lang="ts">
import { defineComponent } from "vue";
import Editbook from "@/components/EditBook.vue";

interface Rating {
  average: number;
  count: number;
}

interface BookDetail {
  rating: Rating;
  _id: string;
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  coverImage: string;
  tags: string[];
  initialQty: number;
  qty: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default defineComponent({
  name: "DetailBookView",
  components: {
    Editbook,
  },
  data: () => ({
    bookDetail: null as BookDetail | null, // Tambahkan validasi untuk null
    fetchError: false,
    isLoading: true,
    isToggled: false,
  }),
  async mounted() {
    try {
      const response = await fetch(
        `http://localhost:4000/book/${this.$route.params.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch book data");
      }
      const data = await response.json();
      this.bookDetail = data; // Sesuaikan dengan format respons API
    } catch (error) {
      console.error(error);
      this.fetchError = true;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async deleteBook() {
      try {
        const response = await fetch(
          `http://localhost:4000/book/${this.$route.params.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete book");
        }
        alert("Book has been removed!");
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        alert("Failed to delete book. Please try again.");
      }
    },
  },
  computed: {
    starRating(): string {
      if (!this.bookDetail || !this.bookDetail.rating) return "";
      const stars = Math.floor(this.bookDetail.rating.average);
      return "⭐".repeat(stars);
    },
    formattedCreatedAt(): string {
      return this.bookDetail
        ? new Date(this.bookDetail.createdAt).toLocaleDateString()
        : "";
    },
    formattedUpdatedAt(): string {
      return this.bookDetail
        ? new Date(this.bookDetail.updatedAt).toLocaleDateString()
        : "";
    },
  },
});
</script>

<template>
  <main class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <RouterLink
        to="/"
        class="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </RouterLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="w-12 h-12 border-4 border-blue-500 border-t-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <h1 class="text-2xl font-semibold text-gray-700">
          Loading Book Details...
        </h1>
      </div>

      <!-- Fetch Error State -->
      <div v-else-if="fetchError" class="text-center py-12">
        <svg
          class="mx-auto h-24 w-24 text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 class="text-3xl font-bold text-gray-800">
          Failed to Load Book Data
        </h1>
        <p class="text-gray-600 mt-2">Please try again later</p>
      </div>

      <!-- Book Details -->
      <div v-else-if="bookDetail" class="bg-white shadow-lg rounded-xl overflow-hidden">
        <div class="grid md:grid-cols-2 gap-8 p-6 md:p-10">
          <!-- Book Cover -->
          <div class="flex items-center justify-center">
            <img
              :src="bookDetail.coverImage"
              class="rounded-lg max-h-[500px] w-auto object-cover shadow-md"
              alt="Book Cover"
            />
          </div>

          <!-- Book Details Section -->
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 mb-4">
              {{ bookDetail.title }}
            </h1>
            <h2 class="text-xl text-gray-600 mb-4">by {{ bookDetail.author }}</h2>

            <!-- Rating -->
            <div class="flex items-center gap-2 mb-4">
              <span class="text-yellow-500 text-xl">
                {{ starRating }}
              </span>
              <span class="text-gray-600">
                ({{ bookDetail.rating.count }} reviews)
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-700 mb-4">
              {{ bookDetail.description }}
            </p>

            <!-- Publisher & Published Date -->
            <p class="text-gray-600">
              <strong>Publisher:</strong> {{ bookDetail.publisher }}
            </p>
            <p class="text-gray-600">
              <strong>Published Date:</strong> {{ bookDetail.publishedDate }}
            </p>

            <!-- Tags -->
            <div v-if="bookDetail.tags.length" class="mt-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Categories:
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in bookDetail.tags"
                  :key="index"
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Stock -->
            <p class="mt-4 text-gray-600">
              <strong>Initial Quantity:</strong> {{ bookDetail.initialQty }}
            </p>
            <p class="mt-4 text-gray-600">
              <strong>Available Quantity:</strong> {{ bookDetail.qty }}
            </p>

            <!-- Created & Updated Dates -->
            <p class="mt-4 text-gray-600">
              <strong>Created At:</strong> {{ formattedCreatedAt }}
            </p>
            <p class="text-gray-600">
              <strong>Updated At:</strong> {{ formattedUpdatedAt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
