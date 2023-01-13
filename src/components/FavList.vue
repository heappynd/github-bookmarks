<template>
  <div
    class="grid grid-cols-3 gap-4 p-6 pt-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
  >
    <div
      v-for="item in list"
      :key="item.id"
      class="relative flex flex-col items-center justify-center rounded p-2"
      @click="link(item)"
    >
      <img
        class="rounded-lg p-4 shadow-2xl"
        :src="item.owner.avatar_url"
        alt=""
      />
      <div class="w-full truncate py-2 text-center">{{ item.name }}</div>

      <div
        v-if="checked"
        class="absolute -right-2 -top-2 box-content flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-slate-400 p-1 text-white"
        @click.stop="del(item.id)"
      >
        <img src="/assets/close.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Info } from "@/api/types";

defineProps<{
  list: Info[];
  checked: boolean;
}>();

const emit = defineEmits<{
  (event: "del", id: number): void;
}>();

function link(item: Info) {
  const url = item.homepage || item.html_url;
  window.open(url, "_blank");
}
function del(id: number) {
  emit("del", id);
}
</script>
