import { getSetting } from 'query/settings/settings.query'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import BasicSettings from 'shared/components/BasicSettings'
import BonusSettings from 'shared/components/BonusSettings'
import MaintenanceSettings from 'shared/components/MaintenanceSettings'
import TDSSettings from 'shared/components/TDSSettings'
import TransactionSettings from 'shared/components/TransactionSettings'
import Wrapper from 'shared/components/Wrap'
import moment from 'moment-timezone'
import BanStateSettings from 'shared/components/BanStateSettings'
import ReportTitleSettings from 'shared/components/ReportTitleSettings'
import InviteSettings from 'shared/components/InviteSettings'
import GameVersionSettings from 'shared/components/GameVersionSettings'
import PaymentModeSettings from 'shared/components/PaymentModeSettings'

const Settings = () => {
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm({ mode: 'all' })

    const eMaintenanceModeOptions = [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
    ]

    // List
    const { data } = useQuery(['setting'], () => getSetting(), {
        select: (data) => data.data.data?.[0],
        onSuccess: (res) => {
            reset({
                nDefaultChips: +res?.nDefaultChips,
                nDefaultPracticeChips: +res?.nDefaultPracticeChips,
                redeemMinimum: +res?.oRedeem?.nMinimum,
                redeemMaximum: +res?.oRedeem?.nMaximum,
                purchaseMinimum: +res?.oPurchaseRange?.nMinimum,
                purchaseMaximum: +res?.oPurchaseRange?.nMaximum,
                nReferralBonus: +res?.nReferralBonus,
                nWelcomeBonus: +res?.nWelcomeBonus,
                nRakeVip: +res?.oReward?.nRakeVip,
                nVipBonus: +res?.oReward?.nVipBonus,
                nBonusCash: +res?.oReward?.nBonusCash,
                nDeduction: +res?.oTax?.nDeduction,
                nOffset: +res?.oTax?.nOffset,
                eMode: eMaintenanceModeOptions?.find(item => item?.value === res?.oMaintenance?.eMode),
                dStartAt: moment(res?.oMaintenance?.dStartAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', true),
                dEndAt: moment(res?.oMaintenance?.dEndAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', true),
                // eslint-disable-next-line no-unsafe-optional-chaining
                aRestrictedState: data?.aRestrictedState ? [...data?.aRestrictedState] : []
            })
        }
    })

    useEffect(() => {
        document.title = 'Settings | PokerGold'
    }, [])

    return (
        <>
            <Wrapper>
                <Row>
                    <Col xxl={4} lg={6} sm={12}>
                        <BasicSettings register={register} handleSubmit={handleSubmit} errors={errors} settingData={data} reset={reset} />
                    </Col>
                    <Col xxl={8} lg={12} sm={12} className='mt-xxl-0 mt-lg-3 mt-sm-3 mt-3'>
                        <TransactionSettings register={register} handleSubmit={handleSubmit} errors={errors} settingData={data} reset={reset} />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col sm={12}>
                        <BonusSettings handleSubmit={handleSubmit} register={register} errors={errors} reset={reset} settingData={data} />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col lg={6} md={12} sm={12}>
                        <TDSSettings settingData={data} />
                    </Col>
                    <Col lg={6} md={12} sm={12} className='mt-xxl-0 mt-lg-0 mt-md-3 mt-sm-3 mt-3'>
                        <MaintenanceSettings settingData={data} />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col lg={6} md={12} sm={12}>
                        <BanStateSettings settingData={data} />
                    </Col>
                    <Col lg={6} md={12} sm={12} className='mt-xxl-0 mt-lg-0 mt-md-3 mt-sm-3 mt-3'>
                        <ReportTitleSettings settingData={data} />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col sm={12}>
                        <InviteSettings handleSubmit={handleSubmit} register={register} errors={errors} reset={reset} settingData={data} watch={watch} control={control} />
                    </Col>

                    <Col sm={12} className='mt-4'>
                        <GameVersionSettings  settingData={data} />
                    </Col>

                    <Col sm={12} className='mt-4'>
                        <PaymentModeSettings  settingData={data} />
                    </Col>
                </Row>
            </Wrapper>
        </>
    )
}

export default Settings
