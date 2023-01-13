<script setup lang="ts">
import { computed, ref } from "vue";
import { getInfo, getStarred } from "./api";
import type { Info } from "./api/types";
import { useStorage } from "@vueuse/core";
import usePersistence from "./composables/usePersistence";
import FavList from "./components/FavList.vue";

const url = ref("");
const list = useStorage<Info[]>("fav-list", []);

const loading = ref(false);

const checked = ref(false);

async function add() {
  loading.value = true;
  const pathname = new URL(url.value).pathname.substring(1);
  // https://github.com/element-plus/element-plus
  const [owner, repo] = pathname.split("/");
  const info = await getInfo(owner, repo);
  list.value.unshift(info.data);
  loading.value = false;
  url.value = "";
}

async function getStars() {
  const stars = await getStarred(url.value);
  list.value = stars;
}

function del(id: number) {
  const index = list.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    list.value.splice(index, 1);
  }
}

const tabs = ref(["All", "Vue", "React"]);
const active = ref("All");

const filterList = computed(() => {
  if (active.value === "All") return list.value;
  return list.value.filter((item) =>
    item.topics.find((topic) => topic.includes(active.value.toLowerCase()))
  );
});

const { exp, imp } = usePersistence(list);
</script>

<template>
  <div class="p-0">
    <div class="space-x-4 p-8 pb-0">
      <input
        v-model="url"
        type="text"
        placeholder="https://github.com/vitejs/vite"
        class="input-bordered input w-96"
        :disabled="loading"
      />
      <button class="btn-primary btn" :disabled="loading || !url" @click="add">
        Add favorite
      </button>
      <button class="btn-primary btn" :disabled="loading || !url" @click="getStars">
        Get Stars
      </button>

      <button class="btn" :disabled="loading" @click="imp">Import</button>

      <button class="btn" :disabled="loading" @click="exp">Export</button>

      <div>
        <div class="form-control w-1/4">
          <label class="label cursor-pointer">
            <span class="label-text">Delete</span>
            <input
              type="checkbox"
              class="toggle"
              :checked="checked"
              @change="checked = !checked"
            />
          </label>
        </div>

        <div class="tabs pb-4">
          <a
            v-for="tab in tabs"
            :key="tab"
            class="tab tab-bordered"
            :class="{ 'tab-active': active === tab }"
            @click="active = tab"
          >
            {{ tab }}
          </a>
        </div>
      </div>
    </div>

    <FavList :list="filterList" :checked="checked" @del="del" />
  </div>
</template>
