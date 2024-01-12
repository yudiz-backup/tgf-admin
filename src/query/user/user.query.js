import axios from '../../axios'

export async function getUserList(data) {
  return await axios.post('/users/list', data)
}

export async function getUserById(id) {
  return await axios.get(`/users/view/${id}`)
}

export async function getUserStatistic(data) {
  return await axios.post('/statistic/userStat', data)
}

//transaction list
export async function getUserTransactionList(params) {
  return await axios.post(`/transactions/list?iUserID=${params.iUserId}`, params)
}

//withdrawal list
export async function getUserWithdrawalList(params) {
  return await axios.post(`/transactions/withdrawal/list?iUserID=${params.iUserId}`, params)
}

//kyc list
export async function getKYCVerificationList(data) {
  return await axios.post(`/users/kyc/list`, data)
}

export async function getUserKYC(data) {
  return await axios.get(`/users/kyc/view/${data?.id}`, data?.payload)
}

export async function getUserOperation(data) {
  return await axios.post('/users/operations', data)
}