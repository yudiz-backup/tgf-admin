import axios from '../../axios'

export async function getTicketsList(data) {
    return await axios.get(`/tournament/ticket/list?nLimit=${data?.nLimit}&nStart=${data?.nStart}&sort=${data?.sort}&orderBy=${data?.orderBy}&totalElements=${data?.totalElements}`, data)
}

export async function getTicketDropDownList () {
    return await axios.get('tournament/ticket/dropdown/list')
}

export async function addTicket(data) {
    return await axios.post('/tournament/ticket', data)
}

export async function getTicketById(id) {
    return await axios.get(`/tournament/ticket/${id}`)
}

export async function updateTicket(data) {
    return await axios.put(`/tournament/ticket/${data?.id}`, data)
}

export async function deleteTicket(id) {
    return await axios.delete(`/tournament/ticket/${id}`)
}
  