import axios from '../../axios'

export async function getUserTDSList(data) {
    return await axios.post(`/tds/user/list/${data?.iUserId}`, data)
}