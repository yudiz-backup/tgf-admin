import axios from '../../axios'

export async function getUserBonus(data) {
  return await axios.post('/bonus/list', data)
}

export async function getBonusCategory() {
  return await axios.get('/bonus/category/total')
}

export async function getPromoCodeFilterList(data) {
  return await axios.post('/promoCode/filterList', data)
}

export async function getUserBonusByID(id) {
  return await axios.get(`/bonus/view/${id}`)
}