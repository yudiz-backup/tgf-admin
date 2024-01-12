import axios from '../../axios'

export async function getTransactionList(params) {
  return await axios.post(`/transactions/list`, params)
}
