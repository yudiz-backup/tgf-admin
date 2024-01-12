import axios from '../../../axios'

export async function getStoreList (params) {
    return await axios.post('/store/list', params)
}

export async function addStore (payload) {
    return await axios.post('/store/create', payload)
}

export async function updateStoreStatus (data) {
    return await axios.put(`/store/updatestatus/${data?.id}`, data)
}

export async function deleteStore (id) {
    return await axios.get(`/store/delete/${id}`)
}