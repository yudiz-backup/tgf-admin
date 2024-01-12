import { toaster } from "helper/helper";
import { deleteReview } from "query/reviews/review.mutation";
import { getAllReviews } from "query/reviews/reviews.query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import DataTable from "shared/components/DataTable";
import Drawer from "shared/components/Drawer";
import CustomModal from "shared/components/Modal";
import TopBar from "shared/components/Topbar";
import UserFilters from "shared/components/UserListFilter";
import ReviewList from "shared/components/reviewListRow";
import { route } from "shared/constants/AllRoutes";
import { ReviewColumn } from "shared/constants/TableHeaders";
import { appendParams, parseParams } from "shared/utils";

function ReviewsManagement() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ mode: "all" });

  const location = useLocation();
  const parsedData = parseParams(location.search);
  const params = useRef(parseParams(location.search));

  const query = useQueryClient();

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current;
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: +data?.nStart || 0,
      search: data?.search || "",
      nLimit: data?.nLimit || 10,
      sort: data.sort || "",
      orderBy: +data.orderBy === 1 ? "ASC" : "DESC",
    };
  }

  function getSortedColumns(adminTableColumns, urlData) {
    return adminTableColumns?.map((column) =>
      column.internalName === urlData?.sort
        ? { ...column, type: +urlData?.orderBy }
        : column
    );
  }

  const [requestParams, setRequestParams] = useState(getRequestParams());

  const [columns, setColumns] = useState(
    getSortedColumns(ReviewColumn, parsedData)
  );
  const [deleteId, setDeleteId] = useState();
  const [modal, setModal] = useState({ open: false, type: "" });

  // List
  const { isLoading, isFetching, data } = useQuery(
    ["ReviewList", requestParams],
    () => getAllReviews(requestParams),
    {
      select: (data) => data.data,
    }
  );

  // DELETE USER
  const { isLoading: deleteLoading, mutate } = useMutation(
    (deleteId) => deleteReview(deleteId),
    {
      onSettled: (res, err) => {
        if (res) {
          query.invalidateQueries("ReviewList");
          toaster(res?.data?.message);
          setModal({ open: false, type: "", status: "" });
        } else {
          toaster(err?.response?.data?.message, "error");
          setModal({ open: false, type: "", status: "" });
        }
      },
    }
  );

  function handleSort(field) {
    let selectedFilter;
    const filter = columns.map((data) => {
      if (data.internalName === field.internalName) {
        data.type = +data.type === 1 ? -1 : 1;
        selectedFilter = data;
      } else {
        data.type = 1;
      }
      return data;
    });
    setColumns(filter);
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter?.internalName,
      orderBy: selectedFilter.type === 1 ? "ASC" : "DESC",
      isEmailVerified: selectedFilter?.isEmailVerified,
    };
    setRequestParams(params);
    appendParams({
      sort: selectedFilter.type !== 0 ? selectedFilter.internalName : "",
      orderBy: selectedFilter.type,
    });
  }

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case "rows":
        setRequestParams({
          ...requestParams,
          nLimit: Number(value),
          pageNumber: 1,
          nStart: 0,
        });
        appendParams({ nLimit: Number(value), pageNumber: 1, nStart: 0 });
        break;
      case "search":
        setRequestParams({ ...requestParams, search: value, pageNumber: 1 });
        appendParams({ pageNumber: 1 });
        break;
      case "filter":
        setModal({ open: value, type: "filter" });
        break;
      default:
        break;
    }
  }

  function handlePageEvent(page) {
    setRequestParams({
      ...requestParams,
      pageNumber: page,
      nStart: (page - 1) * requestParams.nLimit,
    });
    appendParams({
      pageNumber: page,
      nStart: (page - 1) * requestParams.nLimit,
    });
  }

  const handleConfirmDelete = (id) => {
    mutate(id);
  };

  const onDelete = (id) => {
    setModal({ open: true, type: "delete" });
    setDeleteId(id);
  };

  function handleFilterChange(e) {
    const selectedStates = e?.selectedState?.map((item) => item.value);
    setRequestParams({
      ...requestParams,
      eStatus: e?.eStatus || "",
      eGender: e?.eGender || "",
      isEmailVerified: e?.isEmailVerified || "",
      isMobileVerified: e?.isMobileVerified || "",
      selectedState: selectedStates || "",
    });
  }

  return (
    <>
      <TopBar
        buttons={[
          {
            text: "Add Review",
            icon: "icon-add",
            type: "primary",
            clickEventName: "createUserName",
            btnEvent: () => navigate(route.addReview),
          },
        ]}
      />
      <div>
        <DataTable
          columns={columns}
          header={{
            left: {
              rows: true,
            },
            right: {
              search: false,
              filter: false,
            },
          }}
          sortEvent={handleSort}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          totalRecord={data && (data?.count || 0)}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{
            currentPage: requestParams.pageNumber,
            pageSize: requestParams.nLimit,
          }}
        >
          {data &&
            data?.data?.map((user, index) => {
              return (
                <ReviewList
                  key={user._id}
                  index={index}
                  user={user}
                  onDelete={onDelete}
                  getValues={getValues}
                  register={register}
                  errors={errors}
                  reset={reset}
                />
              );
            })}
          <Drawer
            isOpen={modal.type === "filter" && modal.open}
            onClose={() => setModal({ open: false, type: "" })}
            title="User List Filter"
          >
            <UserFilters
              filterChange={handleFilterChange}
              closeDrawer={() => setModal({ open: false, type: "" })}
              defaultValue={requestParams}
              location={location}
            />
          </Drawer>
        </DataTable>

        <CustomModal
          open={modal.type === "delete" && modal.open}
          handleClose={() => {
            setModal({ open: false, type: "" });
            reset({ sPassword: "" });
          }}
          handleConfirm={handleConfirmDelete}
          disableHeader
          bodyTitle="Confirm Delete?"
          isLoading={deleteLoading}
          confirmValue={deleteId}
        >
          <article>
            <h5>
              <div>Are you sure?</div>
            </h5>
          </article>
        </CustomModal>
      </div>
    </>
  );
}

export default ReviewsManagement;
