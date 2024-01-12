import axios from '../../axios'

export async function getDashboardData (data) {
  return await axios.post('/dashboardV2/v2/count', data)
}

export async function getUserRevenue () {
  return await axios.post('/dashboard/revenue')
}

export async function getUserTransaction () {
  return await axios.post('/dashboard/v2/getTableTransaction')
}
export async function getTds () {
  return await axios.get('/dashboard/v2/get/tds')
}