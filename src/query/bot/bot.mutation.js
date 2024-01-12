import axios from '../../axios'

export async function addBot(data) {
  return await axios.post('/bots/create', data)
}

export async function editBot(data) {
  return await axios.put(`/bots/edit/${data?.id}`, data)
}

export async function deleteBot(data) {
  return await axios.get(`/bots/delete/${data?.id}?sPassword=${data?.sPassword}`, data)
}