import React, { useEffect, useState } from 'react'
import { faArrowRightArrowLeft, faBuildingColumns, faCertificate, faChartLine, faCheck, faCreditCard, faEnvelope, faFileInvoice, faList, faMoneyBill1Wave, faPhone, faRobot, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Row, Spinner } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import Wrapper from 'shared/components/Wrap'
import { useQuery } from 'react-query'
import { getUserById, getUserKYC, getUserOperation, getUserStatistic } from 'query/user/user.query'
import UserDetails from 'shared/components/UserDetails'
import { useForm } from 'react-hook-form'
import { statesColumn } from 'shared/constants/TableHeaders'
import UserStatistic from 'shared/components/UserStatistic'
import UserTDSList from 'shared/components/UserTDSList'
import UserKYCDetail from 'shared/components/UserKYCDetail'
import UserBonusList from 'shared/components/UserBonusList'
import { getUserBonus } from 'query/promotion/promotion.query'
import UserTransaction from 'shared/components/UserTransaction'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import UserBankDetail from 'shared/components/UserBankDetail'
import UserWithdrawalDetail from 'shared/components/UserWithdrawalDetail'
import UserOperation from 'shared/components/UserOperation'

const ViewUser = () => {
    const { id } = useParams()
    const location = useLocation()

    const { control, reset, formState: { errors }, register, getValues, handleSubmit, setValue } = useForm()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const ICONS = {
        VERIFIED: <FontAwesomeIcon icon={faCertificate} className='verified' />,
        NOT_VERIFIED: <FontAwesomeIcon icon={faCertificate} className='not-verified' />,
        TICK: <FontAwesomeIcon icon={faCheck} className='tick' />,
        USER: <FontAwesomeIcon icon={faUser} />,
        BOT: <FontAwesomeIcon icon={faRobot} />,
        CERTIFICATE_BADGE: <FontAwesomeIcon icon={faCertificate} />,
        EMAIL: <FontAwesomeIcon icon={faEnvelope} />,
        PHONE: <FontAwesomeIcon icon={faPhone} />,
    }
    
    const TAB_ICONS = {
        STATISTICS: <FontAwesomeIcon icon={faChartLine} color='#f7b750' />,
        PROFILE: <FontAwesomeIcon icon={faUser} color='#338ef7' />,
        BANK: <FontAwesomeIcon icon={faBuildingColumns} color='#a1a1aa' />,
        KYC: <FontAwesomeIcon icon={faFileInvoice} />,
        TRANSACTION: <FontAwesomeIcon icon={faArrowRightArrowLeft} color='#f7b750' />,
        MONEY: <FontAwesomeIcon icon={faMoneyBill1Wave} color='#45d483' />,
        DOCUMENT: <FontAwesomeIcon icon={faFileLines} color='#a1a1aa' />,
        TDS: <FontAwesomeIcon icon={faCreditCard} color='#338ef7' />,
        OPERATIONS: <FontAwesomeIcon icon={faList} color='#9353d3' />
    }

    const tab_buttons = [
        { label: 'Statistics', icon: TAB_ICONS.STATISTICS, toggle: 'statistics' },
        { label: 'Profile', icon: TAB_ICONS.PROFILE, toggle: 'userDetail' },
        { label: 'Bank Info', icon: TAB_ICONS.BANK, toggle: 'BankInfo' },
        { label: 'KYC Details', icon: TAB_ICONS.KYC, toggle: 'KYCDetail' },
        { label: 'Transaction', icon: TAB_ICONS.TRANSACTION, toggle: 'Transaction' },
        { label: 'Withdrawal', icon: TAB_ICONS.MONEY, toggle: 'Withdrawal' },
        { label: 'Bonus Details', icon: TAB_ICONS.DOCUMENT, toggle: 'BonusDetail' },
        { label: 'TDS Details', icon: TAB_ICONS.TDS, toggle: 'TDSDetail' },
        { label: 'Operations', icon: TAB_ICONS.OPERATIONS, toggle: 'Operation' },
    ]

    const [buttonToggle, setButtonToggle] = useState({
        statistics: false,
        userDetail: true,
        BankInfo: false,
        KYCDetail: false,
        Transaction: false,
        Withdrawal: false,
        BonusDetail: false,
        TDSDetail: false,
        Operation: false,
    })

    useEffect(() => {
        switch (location?.state) {
            case 'KYCDetail':
                setButtonToggle({ KYCDetail: true })
                break;
            case '/finance/transaction':
                setButtonToggle({ Transaction: true })
                break;
            case 'view-rake':
                setButtonToggle({ TDSDetail: true })
                break;
            case 'withdrawal':
                setButtonToggle({ Withdrawal: true })
                break;
            default:
                break
        }
    }, [location?.state])

    // GET SPECIFIC USER
    const { data: userDetail } = useQuery('userDataById', () => getUserById(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                ...data,
                sState: data?.oLocation?.sState,
                sPostalCode: data?.oLocation?.sPostalCode,
                isMobileVerified: data?.isMobileVerified,
            })
        }
    })

    // GET USER STATISTIC
    const { data: userStatistic, isLoading: userLoading } = useQuery('userStatisticData', () => getUserStatistic({ iUserId: id }), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                ...data,
                sState: statesColumn?.find(item => item?.value === data?.oLocation?.sState),
                sPostalCode: data?.oLocation?.sPostalCode
            })
        }
    })

    // GET USER KYC
    const { data: userKYC } = useQuery('userKYCData', () => getUserKYC({ id: id }), {
        enabled: !!id,
        select: (data) => data?.data?.data,
    })

    // GET USER OPERATION
    const { data: userOperation, isLoading: operationLoading, isFetching: operationFetching } = useQuery('userOperationData', () => getUserOperation({ iUserId: id }), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                ...data,
                sState: statesColumn?.find(item => item?.value === data?.oLocation?.sState),
                sPostalCode: data?.oLocation?.sPostalCode
            })
        }
    })

    // GET USER BONUS
    const { data: userBonus } = useQuery('userBonusData', () => getUserBonus(), {
        select: (data) => data?.data?.data,
    })

    useEffect(() => {
        document.title = (userDetail?.eUserType === 'ubot' && id) ? 'View Bot | PokerGold' : 'View User | PokerGold'
    }, [id, userDetail])

    return (
        <>
            <div className='user-basic-upper'>
                <Wrapper>
                    <Row className='p-0 m-0'>
                        <Col xxl='4' lg='4' md='12' sm='12' className='p-0 m-0'>
                            <div className='left-side-user-data'>
                                <div className='profile_icon'>
                                    {userLoading ? <Spinner animation="border" variant="primary" /> :
                                        <>
                                            {userDetail?.sAvatar ? <img src={userDetail?.sAvatar} alt={`${userDetail?.sUserName} profile`} /> : ICONS.USER}
                                            {userDetail?.isEmailVerified === true && userDetail?.eStatus === 'y' ?
                                                <>
                                                    {ICONS.VERIFIED}{ICONS.TICK}
                                                </> :
                                                <>
                                                    {ICONS.NOT_VERIFIED}{ICONS.TICK}
                                                </>
                                            }
                                        </>
                                    }
                                </div>
                                <div className='user-data-name'>{location?.state === 'no-user' ? '-' : userDetail?.sUserName}</div>
                                <div className='user-data-type'>{userDetail?.eUserType}{userDetail?.eUserType === 'ubot' && <span className='bot-icon'>{ICONS.BOT}</span>}</div>
                            </div>
                        </Col>
                        <Col xxl='8' lg='8' md='12' sm='12' className='p-0 m-0'>
                            <div className='right-side-user-data'>
                                <div className='user-basic-data'>
                                    <div className='user-data-email'>
                                        {userDetail?.eUserType === 'user' &&
                                            <span>{ICONS.EMAIL}{location?.state === 'no-user' ? '-'
                                                : (userDetail?.isEmailVerified ? <>{userDetail.sEmail}<span className='verified'>{ICONS.CERTIFICATE_BADGE}</span></>
                                                    : <>{userDetail.sEmail}<span className='not-verified'>{ICONS.CERTIFICATE_BADGE}</span></>) || 'Not Provided'}</span>}
                                    </div>
                                    <div className='user-data-mobile'>
                                        {userDetail?.eUserType === 'user' && <span>{ICONS.PHONE}{location?.state === 'no-user' ? '-'
                                            : (userDetail?.isMobileVerified ? <>{userDetail.sMobile}<span className='verified'>{ICONS.CERTIFICATE_BADGE}</span></>
                                                : <>{userDetail.sMobile}<span className='not-verified'>{ICONS.CERTIFICATE_BADGE}</span></>) || 'Not Provided'}</span>}
                                    </div>
                                </div>
                                <div className='user-details-button-group mt-md-2 mt-sm-2'>
                                    {tab_buttons?.map((button, index) => (
                                        <button key={index} className={buttonToggle[button.toggle] && 'userActive'} onClick={() => setButtonToggle({ [button.toggle]: true })}>
                                            {button.icon} {button.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Wrapper>
            </div>

            <div className='user-basic-lower'>
                {buttonToggle?.statistics && <UserStatistic id={id} userStatistic={userStatistic} />}
                {buttonToggle?.userDetail && <UserDetails id={id} userData={location?.state === 'no-user' ? '-' : userDetail} control={control} errors={errors} register={register} getValues={getValues} setValue={setValue} reset={reset} />}
                {buttonToggle?.KYCDetail && <UserKYCDetail id={id} userKYC={userKYC} />}
                {buttonToggle?.Transaction && <UserTransaction id={id} buttonToggle={buttonToggle} userDetail={userDetail} />}
                {buttonToggle?.BankInfo && <UserBankDetail id={id} control={control} handleSubmit={handleSubmit} errors={errors} register={register} userDetail={userDetail} reset={reset} />}
                {buttonToggle?.Withdrawal && <UserWithdrawalDetail id={id} buttonToggle={buttonToggle} />}
                {buttonToggle?.BonusDetail && <UserBonusList setValue={setValue} id={id} userData={userDetail} userBonus={userBonus} control={control} handleSubmit={handleSubmit} errors={errors} register={register} getValues={getValues} reset={reset} />}
                {buttonToggle?.TDSDetail && <UserTDSList id={id} />}
                {buttonToggle?.Operation && <UserOperation id={id} userOperation={userOperation} operationLoading={operationLoading} operationFetching={operationFetching} />}
            </div>
        </>
    )
}

export default ViewUser
