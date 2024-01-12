import axios from '../../axios'

export async function getPrototypeList(data) {
  return await axios.get(`/tournament/prototype/list?nLimit=${data?.nLimit}&nStart=${data?.nStart}&search=${data?.search}&sort=${data?.sort}&orderBy=${data?.orderBy}&totalElements=${data?.totalElements}&ePokerType=${data?.ePokerType}&eType=${data?.eType}&eStatus=${data?.eStatus}`, data)
}

export async function getPrototypeByID(id) {
  return await axios.get(`/tournament/prototype/${id}`)
}

export async function addPrototype(data) {
  return await axios.post('/tournament/prototype/v2', data)
}

export async function updatePrototype(data) {
  return await axios.put(`/tournament/prototype/${data?._id}`, data)
}

export async function deletePrototype(id) {
  return await axios.delete(`/tournament/prototype/${id}`)
}
