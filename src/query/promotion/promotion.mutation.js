import axios from '../../axios'

export async function addUserBonus(data) {
  return await axios.post('/bonus/create', data)
}