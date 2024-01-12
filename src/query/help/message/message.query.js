import axios from '../../../axios'

export async function getMessageList(data) {
  return await axios.get(`/messageCenter/list?nLimit=${data?.nLimit}&nStart=${data?.nStart}&search=${data?.search}&sort=${data?.sort}&orderBy=${data?.orderBy}&totalElements=${data?.totalElements}&date=${data?.date}`, data)
}

export async function addMessage (payload) {
  return await axios.post('/messageCenter', payload)
}

export async function deleteMessage (id) {
  return await axios.delete(`/messageCenter/${id}`)
}
