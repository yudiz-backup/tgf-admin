import axios from '../../axios'

export async function getSetting () {
    return await axios.get('/setting')
}

// UPDATE SETTINGS
export async function updateSetting (data) {
    return await axios.post(`/setting/update/${data?.id}`, data)
}

// ADD REPORT TITLE SETTINGS
export async function addReportTitleSetting (data) {
    return await axios.post(`/setting/report/add`, data)
}

// DELETE REPORT TITLE SETTINGS
export async function deleteReportTitleSetting (data) {
    return await axios.post(`/setting/report/delete`, data)
}

// INVITE SETTINGS
export async function inviteSetting (data) {
    return await axios.post(`/setting/invite`, data)
}

// CHANGE VERSION STATUS SETTINGS
export async function versionStatusSetting (data) {
    return await axios.put(`/setting/version`, data)
}

// ADD PAYMENT MODE
export async function addPaymentMode (data) {
    return await axios.post('/setting/paymentMethod/add', data)
}