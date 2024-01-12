import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import CommonInput from 'shared/components/CommonInput'
import DataTable from 'shared/components/DataTable'
import CustomModal from 'shared/components/Modal'
import TopBar from 'shared/components/Topbar'
import { MessageListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import { addMessage, deleteMessage, getMessageList } from 'query/help/message/message.query'
import MessageList from 'shared/components/MessageList'
import { Button, Form, Modal } from 'react-bootstrap'

const MessageCenter = () => {
  const query = useQueryClient()
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  const { register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'all' })

  function getRequestParams (e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: (+data?.pageNumber?.[0] - 1) || 0,
      nLimit: data?.nLimit || 10,
      search: data?.search || '',
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
      totalElements: data?.totalElements || 0,
      date: data?.date || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(MessageListColumn, parsedData))
  const [modal, setModal] = useState({ open: false, type: '' })

  // List
  const { isLoading, isFetching, data } = useQuery(['messageList', requestParams], () => getMessageList(requestParams), {
    select: (data) => data.data.data,
  })

  // ADD MESSAGE
  const { mutate: mutateMessage } = useMutation(addMessage, {
    onSuccess: (res) => {
      query.invalidateQueries('messageList')
      toaster(res?.data?.message)
      setModal({ open: false, type: '', status: '' })

      reset({
        sTitle: '',
        sDescription: ''
      })
    }
  })

  // DELETE USER
  const { mutate } = useMutation(deleteMessage, {
    onSuccess: (res) => {
      query.invalidateQueries('messageList')
      toaster(res?.data?.message)
      setModal({ open: false, type: '' })
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

  const handleConfirmDelete = (id) => {
    mutate(id)
  }

  const onDelete = (id, name) => {
    setModal({ open: true, type: 'delete', id })
  }

  function onSubmit (data) {
    mutateMessage({
      sTitle: data?.sTitle,
      sDescription: data?.sDescription
    })
  }

  function handleClear () {
    reset()
  }

  useEffect(() => {
    document.title = 'Message Center | Help Desk | PokerGold'
  }, [])

  return (
    <>
      <TopBar
        buttons={[
          {
            text: 'Add Message',
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createUserName',
            btnEvent: () => setModal({ type: 'add-message', open: true })
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
              filter: false
            }
          }}
          sortEvent={handleSort}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          totalRecord={data && (data?.count?.total || 0)}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
        >
          {data && data?.messages?.map((message, index) => {
            return (
              <MessageList
                key={message._id}
                index={index}
                message={message}
                onDelete={onDelete}
              />
            )
          })}
        </DataTable>

        <Modal show={modal.type === 'add-message' && modal?.open} onHide={() => setModal({ open: false, type: '' })} id='add-bonus'>
          <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title className='add-bonus-header'>Add New Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CommonInput
                type='text'
                register={register}
                errors={errors}
                className={`form-control ${errors?.sTitle && 'error'}`}
                name='sTitle'
                label='Title'
                placeholder='Enter the Message Title'
                required
                onChange={(e) => {
                  e.target.value =
                    e.target.value?.trim() &&
                    e.target.value.replace(/^[0-9]+$/g, '')
                }}
                validation={{
                  required: {
                    value: true,
                    message: 'Title is required'
                  },
                }}
              />

              <CommonInput
                type='textarea'
                register={register}
                errors={errors}
                label='Message'
                required
                className={`form-control ${errors?.sDescription && 'error'}`}
                name='sDescription'
                placeholder='Type your message here...'
                onChange={(e) => e.target.value}
                validation={{
                  required: {
                    value: true,
                    message: 'Message description is required'
                  },
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleClear()}>
                Clear
              </Button>
              <Button variant="primary" type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <CustomModal
          open={modal.type === 'delete' && modal.open}
          handleClose={() => setModal({ open: false, type: '' })}
          handleConfirm={() => handleConfirmDelete(modal?.id)}
          disableHeader
          bodyTitle='Message Center'
        >
          <article>
            <h5>
              <div>
                Are you sure that you want to delete this message ?
              </div>
            </h5>
          </article>
        </CustomModal>
      </div>
    </>
  )
}

export default MessageCenter
