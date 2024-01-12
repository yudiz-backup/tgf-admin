import axios from '../../../axios'

export async function getAdminLogsList (params) {
    return await axios.post('activity/logs/admin/list', params)
}