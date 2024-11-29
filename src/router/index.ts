import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AddBook from "../views/AddBook.vue";
import DetailBook from "../views/DetailBook.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/add-book",
      name: "add-book",
      component: AddBook,
    },
    {
      path: "/detail/:id",
      name: "book detail",
      component: DetailBook,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      redirect(_) {
        return { path: "/" };
      },
    },
  ],
});

export default router;