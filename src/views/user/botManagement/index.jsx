import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { addBot, deleteBot, editBot } from 'query/bot/bot.mutation'
import { getBotList } from 'query/bot/bot.query'
import { getUserById } from 'query/user/user.query'
import { Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import BotList from 'shared/components/BotList'
import CommonInput from 'shared/components/CommonInput'
import CommonPasswordModal from 'shared/components/CommonPasswordModal'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import TopBar from 'shared/components/Topbar'
import UserFilters from 'shared/components/UserListFilter'
import { BotListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const BotManagement = () => {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  const query = useQueryClient()

  const { register, formState: { errors }, reset, getValues, handleSubmit } = useForm({ mode: 'all' })

  function getRequestParams (e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: (+data?.pageNumber?.[0] - 1) || 0,
      nLimit: data?.nLimit || 10,
      eStatus: data?.eStatus || 'y',
      eState: data?.eState || '',
      date: data?.date || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      sort: data.sort || '',
      search: data?.search || '',
      orderBy: 'ASC',
      totalElements: data?.totalElements || 0,
      sPassword: getValues('sPassword') || ''
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(BotListColumn, parsedData))
  const [addBotData, setAddBotData] = useState()
  const [deleteId, setDeleteId] = useState()
  const [modal, setModal] = useState({ open: false, type: '' })

  // List
  const { isLoading, isFetching, data } = useQuery(['botList', requestParams], () => getBotList(requestParams), {
    select: (data) => data.data.data,
  })

  // GET SPECIFIC USER
  useQuery('userDataById', () => getUserById(modal?.type === 'update-modal' && modal?.id), {
    enabled: !!(modal?.type === 'update-modal' && modal?.id),
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        ...data,
        sState: data?.oLocation?.sState,
        sPostalCode: data?.oLocation?.sPostalCode,
        isMobileVerified: data?.isMobileVerified
      })
    }
  })

  // ADD BOT
  const { mutate: addMutate } = useMutation(addBot, {
    onSettled: (response, err) => {
      if (response) {
        toaster(response?.data?.message)
        setModal({ open: false, type: '' })
        query.invalidateQueries('botList')
        reset({})
      } else {
        toaster(err?.response?.data?.message)
        setModal({ open: false, type: '' })
        reset({})
      }
    }
  })

  // EDIT BOT
  const { mutate: editMutate } = useMutation(editBot, {
    onSuccess: (response) => {
      toaster(response?.data?.message)
      setModal({ open: false, type: '', id: '' })
      query.invalidateQueries('botList')
      reset({})
    }
  })

  // DELETE USER
  const { isLoading: deleteLoading, mutate: deleteBotMutate } = useMutation(deleteBot, {
    onSettled: (res, err) => {
      if (res) {
        query.invalidateQueries('botList')
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
      default:
        break
    }
  }

  function handlePageEvent (page) {
    setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
    appendParams({ pageNumber: page, nStart: page - 1 })
  }

  const handleUserCredential = (data) => {
    setModal({ open: true, type: 'delete' })
  }

  const handleConfirmDelete = (id) => {
    deleteBotMutate({
      id: deleteId,
      sPassword: getValues('sPassword')
    })
  }

  const onDelete = (id, name) => {
    setModal({ open: true, type: 'delete-user' })
    setDeleteId(id)
  }

  function handleFilterChange (e) {
    setRequestParams({ ...requestParams, eStatus: e?.eStatus || 'y', eState: e?.eState || '', dStartDate: e?.dStartDate || '', dEndDate: e?.dEndDate || '' })
  }

  const onSubmit = (data) => {
    if (modal?.type === 'update-modal') {
      setModal({ open: true, type: 'confirm-update', id: modal?.id })
    } else {
      setModal({ open: true, type: 'confirm-add' })
    }
    setAddBotData(data)
  }

  const onUpdate = (id) => {
    setModal({ open: true, type: 'update-modal', id: id })
  }

  const handleConfirmUpdate = () => {
    editMutate({
      nChips: +getValues('nChips'),
      nWinningRatio: +getValues('nWinningRatio'),
      sPassword: getValues('sPassword'),
      id: modal?.id
    })
  }

  const handleConfirmAdd = () => {
    addMutate({
      nChips: addBotData?.nChips,
      nNumber: addBotData?.nNumber,
      nWinningRatio: addBotData?.nWinningRatio,
      sPassword: getValues('sPassword')
    })
  }

  const handleClear = () => {
    setModal({ open: false, type: '' })
    reset({})
  }

  useEffect(() => {
    document.title = 'Bot Info | PokerGold'
  }, [])
  return (
    <>
      <TopBar
        buttons={[
          {
            text: 'Add Bot',
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createBot',
            btnEvent: () => setModal({ open: true, type: 'add-bot' })
          },
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
          {data && data?.bots?.map((user, index) => {
            return (
              <BotList
                key={user._id}
                index={index}
                user={user}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            )
          })}
          <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Bot List Filter'>
            <UserFilters
              filterChange={handleFilterChange}
              closeDrawer={() => setModal({ open: false, type: '' })}
              defaultValue={requestParams}
              location={location}
            />
          </Drawer>
        </DataTable>

        <CustomModal
          open={modal.type === 'delete-user' && modal.open}
          handleClose={() => { setModal({ open: false, type: '' }); reset({ sPassword: '' }) }}
          handleConfirm={() => getValues('sPassword') !== undefined && handleUserCredential()}
          disableHeader
          bodyTitle='Delete Bot'
          confirmValue={getValues('sPassword')}
        >
          <article>
            <h5>
              <div>
                Are you sure, you want to delete this bot ?
              </div>
            </h5>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              required
              className={`form-control ${errors?.sPassword && 'error'}`}
              name='sPassword'
              placeholder='Enter password'
              onChange={(e) => {
                e.target.value =
                  e.target.value?.trim() &&
                  e.target.value.replace(/^[0-9]+$/g, '')
              }}
            />
          </article>
        </CustomModal>

        <CustomModal
          open={modal.type === 'delete' && modal.open}
          handleClose={() => setModal({ open: false, type: '' })}
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

        {modal?.type === 'add-bot' &&
          <Form className='step-one' autoComplete='off'>
            <Modal show={modal?.open} onHide={() => setModal({ open: false, id: '' })} id='add-bonus'>
              <Modal.Header closeButton>
                <Modal.Title className='add-bonus-header'>Create Bot</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`for m-control ${errors?.nNumber && 'error'}`}
                  name='nNumber'
                  label='Number of Bots'
                  placeholder='Enter number of Bots'
                  required
                  validation={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    },
                    max: {
                      value: 10,
                      message: 'Number of Bots must be less than 10.'
                    },
                    required: {
                      value: true,
                      message: 'Number of Bot(s) is required'
                    },
                  }}
                  onChange={(e) => {
                    e.target.value =
                      e.target.value?.trim() &&
                      e.target.value.replace(/^[a-zA-z]+$/g, '')
                  }}
                />

                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`for m-control ${errors?.nChips && 'error'}`}
                  name='nChips'
                  label='Bot Wallet Balance'
                  placeholder='Enter the balance of bot wallet'
                  required
                  validation={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    },
                    max: {
                      value: 10000,
                      message: 'Wallet Balance must be less than 10000.'
                    },
                    required: {
                      value: true,
                      message: 'Wallet Balance is required'
                    },
                  }}
                  onChange={(e) => {
                    e.target.value =
                      e.target.value?.trim() &&
                      e.target.value.replace(/^[a-zA-z]+$/g, '')
                  }}
                />

                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`for m-control ${errors?.nWinningRatio && 'error'}`}
                  name='nWinningRatio'
                  label='Bot Winning Ratio'
                  placeholder='Enter the bot winning ratio'
                  required
                  validation={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    },
                    max: {
                      value: 100,
                      message: 'Bot Winning ratio must be less than 100.'
                    },
                    required: {
                      value: true,
                      message: 'Bot winning ratio is required'
                    },
                  }}
                  onChange={(e) => {
                    e.target.value =
                      e.target.value?.trim() &&
                      e.target.value.replace(/^[a-zA-z]+$/g, '')
                  }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClear()}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>}

        <CommonPasswordModal
          bodyTitle={modal?.type === 'confirm-add' ? 'Add Bot' : (modal?.type === 'confirm-update' && 'Update Bot')}
          confirmValue={getValues('sPassword')}
          errors={errors}
          handleConfirm={modal?.type === 'confirm-add' ? handleConfirmAdd : (modal?.type === 'confirm-update' && handleConfirmUpdate)}
          isTextArea={false}
          message={modal?.type === 'confirm-add' ? 'Are you sure want to add bot ?' : (modal?.type === 'confirm-update' && 'Are you sure want to update bot ?')}
          modal={modal?.type === 'confirm-add' ? modal?.open : (modal?.type === 'confirm-update' && modal?.open)}
          name={'sPassword'}
          register={register}
          setModal={setModal}
        />

        {modal?.type === 'update-modal' &&
          <Form className='step-one' autoComplete='off'>
            <Modal show={modal?.open} onHide={() => { setModal({ open: false, id: '' }); reset({}) }} id='add-bonus'>
              <Modal.Header closeButton>
                <Modal.Title className='add-bonus-header'>Update Bot</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`for m-control ${errors?.nChips && 'error'}`}
                  name='nChips'
                  label='Bot Wallet Balance'
                  placeholder='Enter the balance of bot wallet'
                  required
                  validation={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    },
                    max: {
                      value: 10000,
                      message: 'Wallet Balance must be less than 10000.'
                    },
                    required: {
                      value: true,
                      message: 'Wallet Balance is required'
                    },
                  }}
                  onChange={(e) => {
                    e.target.value =
                      e.target.value?.trim() &&
                      e.target.value.replace(/^[a-zA-z]+$/g, '')
                  }}
                />

                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`for m-control ${errors?.nWinningRatio && 'error'}`}
                  name='nWinningRatio'
                  label='Bot Winning Ratio'
                  placeholder='Enter the bot winning ratio'
                  required
                  validation={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    },
                    max: {
                      value: 100,
                      message: 'Bot Winning ratio must be less than 100.'
                    },
                    required: {
                      value: true,
                      message: 'Bot winning ratio is required'
                    },
                  }}
                  onChange={(e) => {
                    e.target.value =
                      e.target.value?.trim() &&
                      e.target.value.replace(/^[a-zA-z]+$/g, '')
                  }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClear()}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>}
      </div>
    </>
  )
}

export default BotManagement
