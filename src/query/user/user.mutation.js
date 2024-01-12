import axios from '../../axios'

export async function addUser(data) {
    return await axios.post('/users/create', data)
}

//add pan card
export async function addUserPanCard(data) {
    return await axios.put('/users/kyc/edit', data)
}

//update pan card status
export async function updateUserKYCCardStatus(data) {
    return await axios.put(`/users/kyc/status/${data?.id}`, data?.payload)
}

//add notification
export async function addNotification(data) {
    return await axios.post('/users/group/push', data)
}

export async function editUser(data) {
    return await axios.put(`/users/edit/${data?.id}`, data?.payload)
}

//confirm approve location
export async function approveUserLocation(data) {
    return await axios.put(`/users/verifyAddress/${data?.id}`, data?.payload)
}

export async function deleteUser(id, sPassword) {
    return await axios.get(`/users/delete/${id}?sPassword=${sPassword}`)
}

export async function changeUserStatus(data) {
    const id = data?.id
    delete data?.id
    return await axios.put(`/users/updatestatus/${id}`, { eStatus: data?.eStatus, sPassword: data?.sPassword })
}

//user bank 
export async function changeBankStatus (data) {
    return await axios.put(`/users/bank/edit/${data?.id}`, data?.payload)
}