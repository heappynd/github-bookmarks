import axios from 'axios'
import { Info } from './types'

export const getInfo = (owner: string, repo: string) =>
  axios.get<Info>(`https://api.github.com/repos/${owner}/${repo}`)
