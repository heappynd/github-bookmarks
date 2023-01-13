import type { Info } from "@/api/types";
import { saveAs } from "file-saver";
import type { Ref } from "vue";

export default function usePersistence(list: Ref<Info[]>) {
  async function imp() {
    // TODO: experimental
    const objects = await (window as any).showOpenFilePicker();
    const file = await objects[0].getFile();
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      console.log(reader.result);
      const json = reader.result as string;
      list.value = JSON.parse(json);
    });
    reader.readAsText(file);
  }
  function exp() {
    const date = new Date();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const file = new File([JSON.stringify(list.value)], `info-${m}-${d}.json`);
    saveAs(file);
  }

  return {
    imp,
    exp,
  };
}
