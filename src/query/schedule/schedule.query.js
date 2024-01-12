import axios from '../../axios'

export async function getScheduleList(data) {
  return await axios.get(`/tournament/schedule/list?nLimit=${data?.nLimit}&nStart=${data?.nStart}&search=${data?.search}&sort=${data?.sort}&orderBy=${data?.orderBy}&totalElements=${data?.totalElements}&ePokerType=${data?.ePokerType}&eType=${data?.eType}&eState=${data?.eState}&eStatus=${data?.eStatus}&dStartDate=${data?.dStartDate}&dEndDate=${data?.dEndDate}`, data)
}

// SCHEDULE TOURNAMENT TABLE LIST
export async function getFinishedScheduleTable (id, params) {
  return axios.get(`/tournament/schedule/finished/${id}?nStart=${params?.nStart}&nLimit=${params?.nLimit}&sort=${params?.sort}&orderBy=${params?.orderBy}&totalElement=${params?.totalElements}&eStatus=${params?.eStatus}&search=${params?.search}`, params)
}

// SCHEDULE TOURNAMENT TABLE LIST LIST
export async function getLiveScheduleTable (id, params) {
  return axios.get(`/tournament/schedule/live/${id}?nStart=${params?.nStart}&nLimit=${params?.nLimit}&sort=${params?.sort}&orderBy=${params?.orderBy}&totalElement=${params?.totalElements}&eStatus=${params?.eStatus}&search=${params?.search}`, params)
}

// SCHEDULE PLAYER INFO LIST
export async function getSchedulePlayerInfo (id, params) {
  return axios.get(`/tournament/schedule/users/${id}?nStart=${params?.nStart}&nLimit=${params?.nLimit}&sort=${params?.sort}&orderBy=ASC&totalElement=${params?.totalElements}&search=${params?.search}`, params)
}

// SCHEDULE TOURNAMENT WINNER LIST
export async function getScheduleTournamentWinner (id, params) {
  return axios.get(`/tournament/schedule/users/winners/${id}?nStart=${params?.nStart}&nLimit=${params?.nLimit}&sort=${params?.sort}&orderBy=ASC&totalElement=${params?.totalElements}&search=${params?.search}`, params)
}

export async function getScheduleByID(id) {
    return await axios.get(`/tournament/schedule/${id}`)
}

export async function addSchedule(data) {
  return await axios.post(`/tournament/schedule/create`, data)
}

export async function updateSchedule(data) {
  return await axios.put(`/tournament/schedule/${data?._id}`, data)
}

export async function deleteSchedule(id) {
    return await axios.delete(`/tournament/schedule/${id}`)
 }