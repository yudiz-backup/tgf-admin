import React, { useEffect, useRef, useState } from 'react'
import { addBanner, deleteBanner, getBannerList } from 'query/help/banner/banner.query'
import { Button, Form, Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import BannerList from 'shared/components/BannerList'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import TopBar from 'shared/components/Topbar'
import { BannerListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import Select from 'react-select'
import { fileToDataUri, toaster } from 'helper/helper'
import BannerFilter from 'shared/components/BannerFilter'

const Banner = () => {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  const { control, formState: { errors }, reset, handleSubmit, watch } = useForm({ mode: 'all' })

  const query = useQueryClient()

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
      dStartDate: data.dStartDate || '',
      dEndDate: data.dEndDate || '',
      eRoute: data?.eRoute || ''
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(BannerListColumn, parsedData))
  const [modal, setModal] = useState({ open: false, type: '' })
  const [bannerID, setBannerID] = useState()

  // List
  const { isLoading, isFetching, data } = useQuery(['bannerList', requestParams], () => getBannerList(requestParams), {
    select: (data) => data.data.data,
  })

  const routeOption = [
    { label: 'Tournament', value: 'tournament' },
    { label: 'Store', value: 'store' },
  ]

  // ADD BANNER
  const { mutate: mutateBanner } = useMutation(addBanner, {
    onSuccess: (res) => {
      query.invalidateQueries('bannerList')
      toaster(res?.data?.message)
      setModal({ open: false, type: '', status: '' })

      reset({
        eRoute: '',
        sUrlBlob: ''
      })
    }
  })

  // DELETE BANNER
  const { mutate } = useMutation(deleteBanner, {
    onSuccess: (res) => {
      query.invalidateQueries('bannerList')
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

  function handleFilterChange (e) {
    setRequestParams({ ...requestParams, eRoute: e?.eRoute || '', dStartDate: e?.dStartDate || '', dEndDate: e?.dEndDate || '' })
  }

  async function onSubmit (data) {
    let sUrlBlob = data.sUrlBlob;

    if (sUrlBlob) {
      const dataUri = await fileToDataUri(sUrlBlob);
      sUrlBlob = dataUri;
    }

    mutateBanner({
      eRoute: data?.eRoute?.value,
      sUrlBlob: sUrlBlob
    })
  }

  function handleClear () {
    reset()
  }

  useEffect(() => {
    document.title = 'Banner | Help Desk | PokerGold'
  }, [])

  return (
    <>
      <TopBar
        buttons={[
          {
            text: 'Add Banner',
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createUserName',
            btnEvent: () => setModal({ type: 'add-banner', open: true })
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
          totalRecord={data && (data?.count?.total || 0)}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
        >
          {data && data?.banners?.map((banner, index) => {
            return (
              <BannerList
                key={banner._id}
                index={index}
                banner={banner}
                onDelete={onDelete}
                modal={modal}
                setModal={setModal}
                setBannerID={setBannerID}
                bannerID={bannerID}
              />
            )
          })}
          <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Banner List Filter'>
            <BannerFilter
              filterChange={handleFilterChange}
              closeDrawer={() => setModal({ open: false, type: '' })}
              defaultValue={requestParams}
            />
          </Drawer>
        </DataTable>

        <Modal show={modal.type === 'add-banner' && modal?.open} onHide={() => setModal({ open: false, type: '' })} id='add-banner'>
          <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title className='add-banner-header'>Add New Banner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='form-group'>
                <Form.Label>
                  <span>
                    Route
                    <span className='inputStar'>*</span>
                  </span>
                </Form.Label>
                <Controller
                  name='eRoute'
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Route on is required'
                    }
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      placeholder='Select route on'
                      ref={ref}
                      options={routeOption}
                      className={`react-select border-0 ${errors.eRoute && 'error'}`}
                      classNamePrefix='select'
                      isSearchable={false}
                      value={value}
                      onChange={onChange}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                    />
                  )}
                />
                {errors.eRoute && (
                  <Form.Control.Feedback type='invalid'>
                    {errors.eRoute.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <div className='banner'>
                <label>Banner<span className='inputStar'>*</span></label>
                <div className='inputtypefile mt-2'>
                  <div className='inputMSG'>
                    <span>Add Banner Pics</span>
                  </div>

                  <Controller
                    name={`sUrlBlob`}
                    control={control}
                    rules={{
                      required: "Please add Banner Image",
                      validate: {
                        fileType: (value) => {
                          if (value && typeof (watch(`sUrlBlob`)) !== 'string') {
                            const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                            const fileExtension = value.name.split('.').pop().toLowerCase();

                            if (!allowedFormats.includes(fileExtension)) {
                              return "Unsupported file format";
                            }

                            const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                            if (value.size >= maxSize) {
                              return "File size must be less than 1MB";
                            }
                          }
                          return true;
                        },
                      }
                    }}
                    render={({ field: { onChange, value, ref } }) => {

                      return <>
                        <Form.Control
                          ref={ref}
                          type='file'
                          name={`sUrlBlob`}
                          // disabled={updateFlag}
                          accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                          errors={errors}
                          className={errors?.sUrlBlob && 'error'}
                          onChange={(e) => {
                            onChange(e.target.files[0])
                          }}
                        />
                      </>
                    }}
                  />
                </div>
                <div className="document-preview-group">
                  {watch('sUrlBlob') && (
                    typeof (watch('sUrlBlob')) !== 'string'
                      ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sUrlBlob'))} alt='altImage' /> </div>
                      : <div className="document-preview"><img src={watch('sUrlBlob')} alt='altImage' /> </div>)}
                </div>

                <span className='card-error'>{errors && errors?.sUrlBlob && <Form.Control.Feedback type="invalid">{errors?.sUrlBlob.message}</Form.Control.Feedback>}</span>
              </div>
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
          bodyTitle='Banner'
        >
          <article>
            <h5>
              <div>
                Are you sure that you want to delete this banner ?
              </div>
            </h5>
          </article>
        </CustomModal>
      </div>
    </>
  )
}

export default Banner
