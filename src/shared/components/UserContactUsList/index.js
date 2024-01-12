import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const UserContactUsList = ({ user, index }) => {
  return (
    <>
      <tr key={user._id}>
        <td>{index + 1}</td>
        <td className="date-data-field">{user?.sFirstName}</td>
        <td className="date-data-field">{user?.sLastName}</td>
        <td className="date-data-field">{user?.sEmail}</td>
        <td className="date-data-field">{user?.sMessage}</td>
        <td className="date-data-field">{moment(user?.dCreatedAt).format('DD-MM-YYYY') || '-'}</td>
      </tr>
    </>
  );
};

export default UserContactUsList;

UserContactUsList.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onDelete: PropTypes.func,
};
