import React, { useEffect, useRef, useState } from 'react'
import { getUserBonus } from 'query/promotion/promotion.query'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { BonusCategory, UserBonusListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import DataTable from '../DataTable'
import Drawer from '../Drawer'
import BonusFilters from '../BonusFilters'
import Select from 'react-select'
import Datetime from 'react-datetime';
import { Button, Form, Modal } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import moment from 'moment-timezone'
import { addUserBonus } from 'query/promotion/promotion.mutation'
import { toaster } from 'helper/helper'
import BonusList from '../BonusList'

const UserBonusList = ({ id, userData }) => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { control, register, formState: { errors }, reset, handleSubmit, setValue } = useForm({ mode: 'all' })

    const query = useQueryClient()

    const [expiryDate, setExpiryDate] = useState(null)
    const [key, setKey] = useState(0)

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            search: data?.search || '',
            eType: data.eType || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElements: data?.totalElements || 0,
            iUserId: id,
            eCategory: data.eCategory || '',
            dateFrom: data?.dateFrom || '',
            dateTo: data?.dateTo || ''
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(UserBonusListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['userBonusList', requestParams], () => getUserBonus(requestParams), {
        select: (data) => data.data.data,
    })

    // ADD USER
    const { mutate: addBonusMutate } = useMutation(addUserBonus, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('userBonusList')
            setModal({ open: false, type: '' })
            reset({
                dExpiredAt: '',
                eCategory: BonusCategory?.[0],
                nBonus: ''
            })

            setValue("dExpiredAt", null)
            setExpiryDate(null)
            setKey(key + 1)
        }
    })

    function handleSort (field) {
        let selectedFilter
        const filter = columns.map((data) => {
            if (data.internalName === field.internalName) {
                data.type = +data.type === 1 ? -1 : 1
                selectedFilter = data
            } else {
                data.type = 1
            }
            return data
        })
        setColumns(filter)
        const params = {
            ...requestParams,
            page: 0,
            sort: selectedFilter?.internalName,
            orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC',
            isEmailVerified: selectedFilter?.isEmailVerified
        }
        setRequestParams(params)
        appendParams({
            sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
            orderBy: selectedFilter.type
        })
    }

    async function handleHeaderEvent (name, value) {
        switch (name) {
            case 'rows':
                setRequestParams({ ...requestParams, nLimit: Number(value), pageNumber: 1 })
                appendParams({ nLimit: Number(value), pageNumber: 1 })
                break
            case 'search':
                setRequestParams({ ...requestParams, search: value, pageNumber: 1 })
                appendParams({ pageNumber: 1 })
                break
            case 'filter':
                setModal({ open: value, type: 'filter' })
                break
            case 'add': 
                setModal({ open: true, type: 'add-bonus' })
                break
            default:
                break
        }
    }

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eCategory: e?.eCategory, dateFrom: e?.dateFrom, dateTo: e?.dateTo, dExpiredStartDate: e?.dExpiredStartDate, dExpiredEndDate: e?.dExpiredEndDate })
    }

    const onSubmit = (data) => {
        const expiryDate = moment(data?.dExpiredAt._d).tz('Asia/Kolkata').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')

        addBonusMutate({
            iUserId: id,
            dExpiredAt: expiryDate,
            eCategory: data?.eCategory?.value,
            nBonus: +data?.nBonus
        })
    }

    const handleClear = () => {
        reset({
            nBonus: '',
            eCategory: BonusCategory?.[0],
        })

        setValue("dExpiredAt", null)
        setExpiryDate(null)
        setKey(key + 1)
    }

    useEffect(() => {
        document.title = 'User Bonus | PokerGold'
    }, [])
    return (
        <>
            <div>
                <DataTable
                    label={'Bonus Detail'}
                    columns={columns}
                    header={{
                        left: {
                            rows: true
                        },
                        right: {
                            search: true,
                            filter: true,
                            addMode: true,
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={data && (data?.count?.total || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {data && data?.bonus?.map((bonus, index) => {
                        return (
                            <BonusList
                                key={bonus._id}
                                index={index}
                                bonus={bonus}
                                userData={userData}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Bonus List Filter'>
                        <BonusFilters
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>

                <Modal show={modal.type === 'add-bonus' && modal?.open} onHide={() => setModal({ open: false, type: '' })} id='add-bonus'>
                    <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Header closeButton>
                            <Modal.Title className='add-bonus-header'>Add Bonus</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nBonus && 'error'}`}
                                name='nBonus'
                                label='Bonus Amount'
                                placeholder='Enter bonus amount'
                                required
                                validation={{
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Only numbers are allowed'
                                    },
                                    required: {
                                        value: true,
                                        message: 'Bonus Amount is required'
                                    },
                                }}
                                onChange={(e) => {
                                    e.target.value =
                                        e.target.value?.trim() &&
                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                            />
                            <Form.Group className='form-group'>
                                <Form.Label>
                                    <span>
                                        Bonus Category
                                        <span className='inputStar'>*</span>
                                    </span>
                                </Form.Label>
                                <Controller
                                    name='eCategory'
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Bonus Category is required.'
                                        }
                                    }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            placeholder='Select bonus category'
                                            ref={ref}
                                            options={BonusCategory}
                                            className={`react-select border-0 ${errors?.eCategory && 'error'}`}
                                            classNamePrefix='select'
                                            isSearchable={false}
                                            value={value}
                                            onChange={onChange}
                                            getOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                        />
                                    )}
                                />
                                {errors?.eCategory && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.eCategory.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                            <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                <Form.Label>
                                    <span>
                                        Set Expiry Date
                                        <span className='inputStar'>*</span>
                                    </span>
                                </Form.Label>
                                <Controller
                                    name="dExpiredAt"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Start date is required'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Datetime
                                            ref={field.ref}
                                            id="dExpiredAt"
                                            key={key}
                                            inputProps={{
                                                placeholder: 'Select date and time',
                                            }}
                                            value={expiryDate}
                                            onChange={(date) => {
                                                field.onChange(date || null)
                                                setExpiryDate(date || null)
                                            }}
                                        />
                                    )}
                                />
                                {errors?.dExpiredAt && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.dExpiredAt.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className='mt-3'>
                            <Button variant="secondary" onClick={() => handleClear()}>
                                Clear
                            </Button>
                            <Button variant="primary" type='submit'>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

export default UserBonusList
