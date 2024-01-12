import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useQuery } from "react-query";
import { getAllFaqCategoryDropdown } from "query/faq/faq.api";

function QuestionFilters({ filterChange, closeDrawer, defaultValue }) {
  const { handleSubmit, control, reset } = useForm({});
  const [options, setOptions] = useState([]);

  // List
  useQuery(["FaqCategoryList"], () => getAllFaqCategoryDropdown(), {
    select: (data) => data.data,
    onSuccess: (data) => {
      const array = data?.data?.map((i) => {
        return {
          label: i.sTitle,
          value: i._id,
        };
      });
      setOptions(array);
    },
  });

  useEffect(() => {
    reset({
      category: options?.find((item) => item?.value === defaultValue?.id),
    });
  }, [defaultValue, options]);

  function onSubmit(data) {
    filterChange(data);
    closeDrawer();
  }

  return (
    <Form
      className="user-filter"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <Form.Group className="form-group">
        <Form.Label>Category</Form.Label>
        <Controller
          name="category"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              options={options}
              className="react-select"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              onChange={(e) => {
                onChange(e);
              }}
            />
          )}
        />
      </Form.Group>
      <div className="filter-button-group">
        <Button variant="primary" type="submit" className="square apply-button">
          <FormattedMessage id="apply" />
        </Button>
      </div>
    </Form>
  );
}
QuestionFilters.propTypes = {
  filterChange: PropTypes.func,
  closeDrawer: PropTypes.any,
  defaultValue: PropTypes.object,
};
export default QuestionFilters;
