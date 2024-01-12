import axios from '../../../axios'

export async function getReportList (data) {
    return await axios.post(`/report/list`, data)
}

export async function getReportTitle () {
    return await axios.get(`/report/list/getTitle`)
}

export async function getSpecificReport (id) {
    return await axios.get(`/report/view/${id}`)
}

export async function updateReport (data) {
    return await axios.put(`/report/edit/${data?.id}`, data)
}

export async function getTotalCount () {
    return await axios.get(`/report/list/getCount`)
}