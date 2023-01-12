<script setup lang="ts">
import { computed, ref } from "vue";
import { getInfo } from "./api";
import type { Info } from "./api/types";
import { useStorage } from "@vueuse/core";

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

function link(item: Info) {
  const url = item.homepage || item.html_url;
  window.open(url, "_blank");
}

function del(id: number) {
  list.value = list.value.filter((item) => item.id !== id);
}

const tabs = ref(["All", "Vue", "React"]);
const active = ref("All");

const filterList = computed(() => {
  if (active.value === "All") return list.value;
  return list.value.filter((item) =>
    item.topics.find((topic) => topic.includes(active.value.toLowerCase()))
  );
});
</script>

<template>
  <div class="p-0">
    <div class="space-x-4 p-8 pb-0">
      <input
        v-model="url"
        type="text"
        placeholder="Type here"
        class="input-bordered input w-96"
        :disabled="loading"
      />
      <button class="btn" :disabled="loading" @click="add">Add favorite</button>

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

    <div
      class="grid grid-cols-3 gap-4 p-6 pt-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10"
    >
      <div
        v-for="item in filterList"
        :key="item.id"
        class="flex flex-col items-center justify-center rounded p-2"
        @click="link(item)"
      >
        <div class="relative">
          <div
            v-if="checked"
            class="absolute -right-2 -top-2 box-content flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-slate-400 p-1 text-white"
            @click.stop="del(item.id)"
          >
            <img src="/assets/close.svg" alt="" />
          </div>
          <img
            class="h-16 w-16 rounded-lg border p-4 shadow-2xl md:h-20 md:w-20"
            :src="item.owner.avatar_url"
            alt=""
          />
        </div>
        <div class="w-full truncate py-2 text-center">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
