import React from 'react'
import PropTypes from 'prop-types'

function WinnerStatisticListData ({ user, index, key, requestParams }) {

    return (
        <>
            <tr key={key} className={user.eStatus === 'd' && 'deleted-user'}>
                <td>{index + 1}</td>
                <td>{user.sUserName || '-'}</td>
                <td>{user.sMobile || '-'}</td>
                <td>{user.sEmail || '-'}</td>
                <td>{user.nChips?.toFixed(2) || '-'}</td>
                <td>{user.nAmountOut?.toFixed(2) || '-'}</td>
                <td>{user.nAmountIn?.toFixed(2) || '-'}</td>
                <td>
                    <span className={`tag-button ${!requestParams?.isWinners ? 'success' : 'danger'}`}>{user.nProfit?.toFixed(2) || '-'}</span>
                </td>
            </tr>
        </>
    )
}
WinnerStatisticListData.propTypes = {
    user: PropTypes.object,
    index: PropTypes.number,
    key: PropTypes.string
}
export default WinnerStatisticListData
