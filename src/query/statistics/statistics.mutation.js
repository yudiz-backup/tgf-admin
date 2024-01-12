import axios from '../../axios'

export async function getWinnerStatistic (data) {
    return await axios.post('/dashboard/game/leaderBoard', {
        ...data,
        isWinners: true
    })
}

export async function getLoserStatistic (data) {
    return await axios.post('/dashboard/game/leaderBoard', {
        ...data,
        isLosers: true
    })
}