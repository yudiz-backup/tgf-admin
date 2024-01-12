import axios from '../../axios'

export async function profile () {
  return await axios.get('/setting/getdetails')
}

export async function UpdateProfile (profileData) {
  return await axios.post('/setting/updatedetails', profileData)
}

export async function checkToken (sVerifyToken) {
  return await axios.post('/auth/token', sVerifyToken)
}
