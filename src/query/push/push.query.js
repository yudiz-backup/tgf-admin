import axios from '../../axios'

export async function getNotificationList(data) {
  return await axios.post('/push/list', data)
}

export async function addNotification(data) {
  return await axios.post('/push/create', data)
}

export async function deleteNotification(id) {
  return await axios.get(`/push/delete/${id}`)
}

