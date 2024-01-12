import axios from '../../axios'

export async function getNLHList(data) {
  return await axios.post('/nlh/tableList', data)
}

export async function addNLH(data) {
  return await axios.post('/nlh/addnlh', data)
}

export async function getNLHByID(id) {
  return await axios.get(`/nlh/view/${id}`, id)
}

export async function deleteNLH(id) {
  return await axios.get(`/nlh/delete/${id}`)
}

export async function changeNLHStatus(data) {
  const id = data?.id
  delete data?.id
  return await axios.put(`/nlh/updatestatus/${id}`, { eStatus: data?.eStatus })
}

//GET PLO LIST
export async function getPLOList(data) {
  return await axios.post('/poker/tables/list', data)
}

export async function addPLO(data) {
  return await axios.post('/poker/tables/create', data)
}

export async function changePLOStatus(data) {
  const id = data?.id
  delete data?.id
  return await axios.put(`/poker/tables/updatestatus/${id}`, { eStatus: data?.eStatus })
}

export async function deletePLO(id) {
  return await axios.get(`/poker/tables/delete/${id}`)
}
