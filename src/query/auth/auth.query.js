import axios from '../../axios'

export async function login ({ sEmail, sPassword }) {
  return await axios.post('/admin/auth/login/v1', {
    sEmail,
    sPassword
  })
}

export async function forgotPassword ({ sEmail }) {
  return await axios.post('/admin/auth/forgot-password/v1', {
    sEmail
  })
}

export async function resetPassWord ({ sNewPassword,token }) {
  return await axios.post( `/admin/auth/reset-password/v1?sToken=${token}`, { sNewPassword }, { headers: { authorization: token } } )
}

export async function logout () {
  return await axios.put(`/admin/auth/logout/v1`)
}

export async function changePassWord ({ sOldPassword, sNewPassword, id }) {
  return await axios.post(`/admin/auth/change-password/v1?id=${id}`, { sOldPassword, sNewPassword })
}
