import axios from 'axios'
import { Info } from './types'

export const getInfo = (owner: string, repo: string) =>
  axios.get<Info>(`https://api.github.com/repos/${owner}/${repo}`)

export const getStarred = (
  username: string,
  page: number = 1,
  per_page: number = 10
) =>
  axios.get<Info[]>(`https://api.github.com/users/${username}/starred`, {
    params: {
      per_page,
      page,
    },
  })
