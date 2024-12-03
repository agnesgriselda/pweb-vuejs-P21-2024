<template>
  <div class="flex lg:ml-24 gap-x-10 flex-col lg:flex-row mt-8">
    <!-- Book Cover -->
    <div class="w-full md:w-4/6 lg:w-[500px] lg:flex-shrink-0">
      <img
        v-if="bookDetails.coverImage"
        :src="bookDetails.coverImage"
        class="rounded-xl w-full"
        alt="Book Cover"
      />
    </div>

    <!-- Form Edit Book -->
    <div class="mt-10 lg:mt-0 lg:pr-24 w-full">
      <h1 class="font-bold text-xl md:text-2xl lg:text-3xl text-left">
        Edit Book: {{ bookTitle }}
      </h1>
      <hr class="border border-black my-2" />

      <!-- Form Fields -->
      <div class="mb-4">
        <label for="title" class="font-bold">Title:</label>
        <input
          id="title"
          type="text"
          v-model="bookDetails.title"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="author" class="font-bold">Author:</label>
        <input
          id="author"
          type="text"
          v-model="bookDetails.author"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="rating" class="font-bold">Rating:</label>
        <input
          id="rating"
          type="number"
          v-model="bookDetails.rating.average"
          min="0"
          max="5"
          step="0.1"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="description" class="font-bold">Description:</label>
        <textarea
          id="description"
          v-model="bookDetails.description"
          class="w-full border p-2 rounded mt-2"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="publishedDate" class="font-bold">Published Date:</label>
        <input
          id="publishedDate"
          type="date"
          v-model="bookDetails.publishedDate"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="publisher" class="font-bold">Publisher:</label>
        <input
          id="publisher"
          type="text"
          v-model="bookDetails.publisher"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="tags" class="font-bold">Categories:</label>
        <input
          id="tags"
          type="text"
          v-model="tagsInput"
          placeholder="Enter tags separated by commas"
          class="w-full border p-2 rounded mt-2"
        />
        <small class="text-gray-600 text-sm">
          Current Tags: {{ bookDetails.tags.join(", ") }}
        </small>
      </div>

      <div class="mb-4">
        <label for="qty" class="font-bold">Stock:</label>
        <input
          id="qty"
          type="number"
          v-model="bookDetails.qty"
          min="0"
          class="w-full border p-2 rounded mt-2"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <button
          @click="saveChanges"
          class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
        >
          Save Changes
        </button>
        <button
          @click="cancelEdit"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export interface Rating {
  average: number;
  count: number;
}

export interface BookDetails {
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
  name: "Editbook",
  data: () => ({
    bookTitle: "",
    bookDetails: {
      rating: { average: 0, count: 0 },
      tags: [],
    } as BookDetails,
    tagsInput: "", // Field untuk mengedit tags
    fetchError: false,
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
      this.bookTitle = data.data.title;
      this.bookDetails = { ...data.data };
      this.tagsInput = data.data.tags.join(", ");
    } catch (error) {
      console.error(error);
      this.fetchError = true;
    }
  },
  methods: {
    saveChanges() {
      this.bookDetails.tags = this.tagsInput
        .split(",")
        .map((tag) => tag.trim()); // Update tags dari input
      // Kirim data ke server
      fetch(`http://localhost:4000/book/${this.bookDetails._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.bookDetails),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update book");
          }
          alert("Book details updated successfully!");
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to update book. Please try again.");
        });
    },
    cancelEdit() {
      this.$router.push(`/book/${this.bookDetails._id}`); // Kembali ke detail buku
    },
  },
});
</script>