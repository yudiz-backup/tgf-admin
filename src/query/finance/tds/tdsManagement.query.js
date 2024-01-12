import axios from '../../../axios'

export async function getTDSList (params) {
    return await axios.post('/tds/tdsList', params)
}