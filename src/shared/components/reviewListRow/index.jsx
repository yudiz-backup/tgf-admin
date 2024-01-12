import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { route } from "shared/constants/AllRoutes";
import PropTypes from 'prop-types'



const ReviewList = ({
  user,
  index,
  onDelete,
}) => {
  const navigate = useNavigate()

  return (
    <>
      <tr key={user._id} className={user.eStatus === "d" && "deleted-user"}>
        <td>{index + 1}</td>
        <td className="date-data-field">{user?.sUserName}</td>
        <td className="date-data-field">{user?.nRating}</td>
        <td>
          <Dropdown className="dropdown-datatable">
            <Dropdown.Toggle className="dropdown-datatable-toggle-button">
              <div className="">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-datatable-menu">
              <Dropdown.Item
                className="dropdown-datatable-items edit"
                onClick={() => navigate(route.editReview(user._id))}
              >
                <div className="dropdown-datatable-items-icon">
                  <i className="icon-create d-block" />
                </div>
                <div className="dropdown-datatable-row-text">Update</div>
              </Dropdown.Item>
              <Dropdown.Item
                className="dropdown-datatable-items"
                onClick={() => onDelete(user._id)}
              >
                <div className="dropdown-datatable-items-icon">
                  <i className="icon-delete d-block" />
                </div>
                <div className="dropdown-datatable-row-text">Delete</div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </>
  );
};

export default ReviewList;

ReviewList.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onDelete: PropTypes.func
}

