import axios from '../../../axios'

export async function getBannerList (data) {
    return await axios.post(`/banner/list`, data)
}

export async function addBanner (data) {
    return await axios.post(`/banner/create`, data)
}

export async function viewBanner (id) {
    return await axios.get(`/banner/view/${id}`)
}

export async function editBanner (payload) {
    return await axios.put(`/banner/edit/${payload?.id}`, payload)
}

export async function deleteBanner (id) {
    return await axios.get(`/banner/delete/${id}`)
}