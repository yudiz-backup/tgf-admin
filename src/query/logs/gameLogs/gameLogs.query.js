import axios from '../../../axios'

export async function getTableLogs (id, eState) {
    return await axios.get(`/game/finished/log/tableDetails/${id}?state=${eState}`, eState)
}

// GAME LOGS LIVE LIST (RUNNING)
export async function getLiveGameLogs (params) {
    return await axios.post(`/game/table/live`, params)
}

// GAME LOGS LIVE LIST (FINISHED)
export async function getLiveFinishedGameLogs (params) {
    return await axios.post(`/game/table/finished`, params)
}

// GAME LOGS LIVE TABLE LIST 
export async function getLiveTableGameLogs (id, params) {
    return await axios.post(`/game/live/log/list/${id}`, params)
}

export async function getTableLogsList (id, params) {
    return await axios.post(`/game/finished/log/list/${id}`, params)
}

export async function getGameLogTableCountList (id, params) {
    return await axios.get(`/game/log/table/list/${id?.split('-')?.[0]}`, params)
}

// LIVE AND FINISHED
export async function getPlayerGameInfoList (id, params) {
    return await axios.get(`/game/log/player/info/${id}?state=${params}`, params)
}

// LIVE SPECT DATA
export async function getSpectDataList (id) {
    return await axios.get(`/game/log/spect/${id}`)
}

// DROPDOWN NAME LIST
export async function getNameDropdownList (params) {
    return await axios.get(`/game/dropdown/name/list?ePokerType=${params?.ePokerType}`, params)
}

export async function getEagleEyeList (id) {
    return await axios.get(`/game/log/eagleEye/${id}`)
}

