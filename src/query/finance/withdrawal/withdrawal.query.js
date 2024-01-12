import axios from '../../../axios'

export async function getWithdrawalList (params) {
    return await axios.post('/transactions/withdrawal/list', params)
}