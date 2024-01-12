import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import {  PASSWORD } from "shared/constants";
import { validationErrors } from "shared/constants/ValidationErrors";
import { useMutation } from "react-query";
import { resetPassWord } from "query/auth/auth.query";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "helper/helper";
import NotFound from "shared/components/404";

function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    newPassword: true,
    confirmPassword: true,
  });
  const sNewPassword = useRef({});
  const { token } = useParams();
  const [tokneWrong, setTokenWrong] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenWrong(true);
    }
  }, [token]);

  const {
    register: fields,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  sNewPassword.current = watch("sNewPassword");

  function handlePasswordToggle(name) {
    if (name === "newPassword") {
      setShowPassword({
        ...showPassword,
        newPassword: !showPassword.newPassword,
      });
    } else {
      setShowPassword({
        ...showPassword,
        confirmPassword: !showPassword.confirmPassword,
      });
    }
  }

  const { mutate, isLoading } = useMutation(resetPassWord, {
    onSuccess: (response) => {
      navigate("/login");
      toaster(response?.data?.message);
    },
  });

  function onSubmit(data) {
    mutate({ sNewPassword: data.sNewPassword, token });
  }

  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="title-b">
            <h2 className="title">
              <FormattedMessage id="resetPassword" />
            </h2>
          </div>
          {tokneWrong ? (
            <div className="reset_expire">
              <h5>Your Reset Password Link is expired</h5>
              <NotFound />
            </div>
          ) : (
            <>
              <Form.Group className="form-group">
                <Form.Label>
                  <FormattedMessage id="newPassword" />
                  <span className="inputStar">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword.newPassword ? "password" : "text"}
                    required
                    name="sNewPassword"
                    placeholder="Enter your new password"
                    className={errors.sNewPassword && "error"}
                    {...fields("sNewPassword", {
                      required: {
                        value: true,
                        message: validationErrors.newPasswordRequired,
                      },
                      pattern: {
                        value: PASSWORD,
                        message: validationErrors.passwordRegEx,
                      },
                      maxLength: {
                        value: 15,
                        message: validationErrors.rangeLength(8, 15),
                      },
                      minLength: {
                        value: 8,
                        message: validationErrors.rangeLength(8, 15),
                      },
                      onChange: (e) => {
                        e.target.value = e?.target?.value?.trim();
                      },
                    })}
                  />
                  <Button
                    onClick={() => handlePasswordToggle("newPassword")}
                    variant="link"
                    className="icon-right"
                  >
                    <i
                      className={
                        showPassword.newPassword
                          ? "icon-visibility"
                          : "icon-visibility-off"
                      }
                    ></i>
                  </Button>
                </InputGroup>
                {errors.sNewPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.sNewPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>
                  <FormattedMessage id="confirmNewPassword" />
                  <span className="inputStar">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword.confirmPassword ? "password" : "text"}
                    required
                    name="sConfirmPassword"
                    placeholder="Enter same new password"
                    className={errors.sConfirmPassword && "error"}
                    {...fields("sConfirmPassword", {
                      required: {
                        value: true,
                        message: validationErrors.confirmRequired,
                      },
                      validate: (value) =>
                        value !== sNewPassword.current
                          ? "Password does not match."
                          : clearErrors("sConfirmPassword"),
                      onChange: (e) => {
                        e.target.value = e?.target?.value?.trim();
                      },
                    })}
                  />
                  <Button
                    onClick={() => handlePasswordToggle("confirmPassword")}
                    variant="link"
                    className="icon-right"
                  >
                    <i
                      className={
                        showPassword.confirmPassword
                          ? "icon-visibility"
                          : "icon-visibility-off"
                      }
                    ></i>
                  </Button>
                </InputGroup>
                {errors.sConfirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.sConfirmPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isLoading}>
                <FormattedMessage id="submit" />{" "}
                {isLoading && <Spinner animation="border" size="sm" />}
              </Button>
            </>
          )}
       
    </Form>
  );
}
export default ResetPassword;
