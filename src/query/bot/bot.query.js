import axios from '../../axios'

export async function getBotList(data) {
  return await axios.post('/bots/list', data)
}