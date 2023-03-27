import React from "react";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import { Link, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Checkbox
} from "antd";
import loginIllustrator from "@/assets/images/login-illustrator.jpg";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import AuthService from "@/services/auth";

const { Title } = Typography;

const Register = () => {
  const authService = new AuthService();
  const history = useHistory();

  const formatData = (data: any) => {
    return {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber
    };
  };

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Password and confirm password are not the same");
      return;
    }
    const res = await authService.register(formatData(values));
    if (res.status === "OK") {
      toast.success("Register successfully");
      setTimeout(() => {
        history.push("/login");
      }, 1000);
    } else {
      if (res.status === variables.DUPLICATE_ENTITY) {
        toast.error(messages.DUPLICATE_ENTITY("email"));
      } else if (res.status === variables.ARGUMENT_NOT_VALID) {
        toast.error(res?.errors?.details || messages.ARGUMENT_NOT_VALID);
      } else {
        toast.error(messages.EXCEPTION);
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Row
        justify="center"
        align="middle"
        style={{ flexDirection: "column", flex: 1 }}
      >
        <>
          <img
            className="login-illustrator"
            style={{ width: "500px" }}
            src={loginIllustrator}
            alt="login-illustrator"
          />
          <Title level={3} style={{ margin: "5vh 0px 3vh 0" }}>
            Register for HCMUS Tour Dashboard
          </Title>
          <Form
            style={{ maxWidth: "400px", width: "100%" }}
            name="admin-login"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!"
                },
                {
                  type: "email",
                  message: "Please input a valid email!"
                }
              ]}
            >
              <Input placeholder="Email" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              className="mt-2"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]}
            >
              <Input.Password placeholder="Password" prefix={<KeyOutlined />} />
            </Form.Item>

            <Form.Item
              className="mt-2"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Re-enter your password!"
                }
              ]}
            >
              <Input.Password
                placeholder="Re-enter password"
                prefix={<KeyOutlined />}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col md={12}>
                <Form.Item
                  className="mt-2"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Input your first name!"
                    }
                  ]}
                >
                  <Input placeholder="First name" />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  className="mt-2"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Input your last name!"
                    }
                  ]}
                >
                  <Input placeholder="Last name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mt-2" name="mobileNumber">
              <Input placeholder="Mobile number" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="mt-2">
              <Checkbox>
                I agree the{" "}
                <a href="#pablo" className="font-bold text-dark">
                  Terms and Conditions
                </a>
              </Checkbox>
            </Form.Item>

            <Divider />
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
            <p className="font-semibold text-muted text-center mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-dark font-bold">
                Login here
              </Link>
            </p>
          </Form>
        </>
      </Row>
    </div>
  );
};

export default Register;
