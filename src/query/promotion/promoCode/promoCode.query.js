import axios from '../../../axios'

export async function getPromoCodeList (params) {
    return await axios.post('/promoCode/list', params)
}

export async function getPromoCodeByID (id) {
    return await axios.get(`/promoCode/view/${id}`)
}

export async function addPromoCode (data) {
    return await axios.post(`/promoCode/create`, data)
}

export async function updatePromoCodeStatus (data) {
    return await axios.put(`/promoCode/edit/${data?.id}`, data)
}

export async function deletePromoCode (id) {
    return await axios.get(`/promoCode/delete/${id}`)
}