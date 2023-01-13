import axios from "axios";
import type { Info } from "./types";

export const getInfo = (owner: string, repo: string) =>
  axios.get<Info>(`https://api.github.com/repos/${owner}/${repo}`);

const getStars = (username: string, page: number) =>
  axios.get<Info[]>(`https://api.github.com/users/${username}/starred`, {
    params: {
      per_page: 100,
      page,
    },
  });

export const getStarred = async (username: string) => {
  let res: Info[] = [];
  let page = 1;

  await (async function get() {
    const { data } = await getStars(username, page);
    res = [...res, ...data];
    if (data.length < 100) {
      return;
    } else {
      page++;
      await get();
    }
  })();

  return res;
};
