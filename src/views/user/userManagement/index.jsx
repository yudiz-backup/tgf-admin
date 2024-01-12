import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { deleteUser } from 'query/user/user.mutation'
import { getUserList } from 'query/user/user.query'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import TopBar from 'shared/components/Topbar'
import UserList from 'shared/components/UserList'
import UserFilters from 'shared/components/UserListFilter'
import { route } from 'shared/constants/AllRoutes'
import { UserListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import CommonPasswordModal from 'shared/components/CommonPasswordModal'

const UserManagement = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { register, formState: { errors }, reset, getValues } = useForm({ mode: 'all' })

    const navigate = useNavigate()
    const query = useQueryClient()

    function getRequestParams(e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1),
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            eStatus: data.eStatus || 'y',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            eGender: data.eGender || '',
            isEmailVerified: '',
            isMobileVerified: '',
            selectedState: []
        }
    }

    function getSortedColumns(adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    
    const [columns, setColumns] = useState(getSortedColumns(UserListColumn, parsedData))
    const [deleteId, setDeleteId] = useState()
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['userList', requestParams], () => getUserList(requestParams), {
        select: (data) => data.data.data,
    })

    // DELETE USER
    const { isLoading: deleteLoading, mutate } = useMutation((deleteId, sPassword) => deleteUser(deleteId, getValues('sPassword')), {
        onSettled: (res, err) => {
            if (res) {
                query.invalidateQueries('userList')
                toaster(res?.data?.message)
                setModal({ open: false, type: '', status: '' })
    
                reset({
                    sPassword: ''
                })
            } else {
                toaster(err?.response?.data?.message, 'error')
                setModal({ open: false, type: '', status: '' })

                reset({
                    sPassword: ''
                })
            }
        }
    })

    function handleSort(field) {
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

    async function handleHeaderEvent(name, value) {
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
            default:
                break
        }
    }

    function handlePageEvent(page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    const handleUserCredential = (data) => {
        setModal({ open: true, type: 'delete' })
    }

    const handleConfirmDelete = (id) => {
        mutate(id)
    }

    const onDelete = (id, name) => {
        setModal({ open: true, type: 'delete-user' })
        setDeleteId(id)
    }

    function handleFilterChange(e) {
        const selectedStates = e?.selectedState?.map(item => item.value)
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eGender: e?.eGender || '', isEmailVerified: e?.isEmailVerified || '', isMobileVerified: e?.isMobileVerified || '', selectedState: selectedStates || '' })
    }

    useEffect(() => {
        document.title = 'User Info | PokerGold'
    }, [])

    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add User',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => navigate(route.addUser)
                    },
                    {
                        text: 'Push Notification',
                        icon: 'icon-send',
                        type: 'primary',
                        clickEventName: 'pushNotification',
                        btnEvent: () => navigate(route.pushNotification)
                    }
                ]}
            />
            <div>
                <DataTable
                    columns={columns}
                    header={{
                        left: {
                            rows: true
                        },
                        right: {
                            search: true,
                            filter: true
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={data && (data?.count?.totalData || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {data && data?.users?.map((user, index) => {
                        return (
                            <UserList
                                key={user._id}
                                index={index}
                                user={user}
                                onDelete={onDelete}
                                getValues={getValues}
                                register={register}
                                errors={errors}
                                reset={reset}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='User List Filter'>
                        <UserFilters
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                            location={location}
                        />
                    </Drawer>
                </DataTable>

                <CommonPasswordModal 
                    bodyTitle={'Delete User'}
                    confirmValue={getValues('sPassword')}
                    errors={errors}
                    handleConfirm={() => handleUserCredential()}
                    isTextArea={false}
                    message={'Are you sure, you want to delete this user ?'}
                    modal={modal.type === 'delete-user' && modal.open}
                    name={'sPassword'}
                    register={register}
                    setModal={() => setModal({ open: false, type: '' })}
                />

                <CustomModal
                    open={modal.type === 'delete' && modal.open}
                    handleClose={() => {setModal({ open: false, type: '' }); reset({ sPassword: '' })}}
                    handleConfirm={handleConfirmDelete}
                    disableHeader
                    bodyTitle='Confirm Delete?'
                    isLoading={deleteLoading}
                    confirmValue={deleteId}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            </div>
        </>
    )
}

export default UserManagement
