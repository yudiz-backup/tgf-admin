import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { TestiMonialPages } from "shared/constants";

function TestiMonialFilter({ filterChange, closeDrawer, defaultValue }) {
  const { handleSubmit, control, reset } = useForm({});

  useEffect(() => {
    reset({
      eType: TestiMonialPages?.find((item) => item?.value === defaultValue?.type),
    });
  }, [defaultValue]);

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
        <Form.Label>Page</Form.Label>
        <Controller
          name="eType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              options={TestiMonialPages}
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
TestiMonialFilter.propTypes = {
  filterChange: PropTypes.func,
  closeDrawer: PropTypes.any,
  defaultValue: PropTypes.object,
};
export default TestiMonialFilter;
