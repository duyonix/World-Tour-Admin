import React, { useEffect } from "react";
import qs from "query-string";
import { authActions } from "../auth.slice";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { Row, Form, Input, Button, Typography, Divider, Switch } from "antd";
import loginIllustrator from "@/assets/images/login-illustrator.jpg";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { code, expired } = qs.parse(location.search);
    if (code) {
      dispatch(authActions.login(code));
    }
    if (expired) {
      toast.error(messages.SESSION_EXPIRE);
    }
  }, [dispatch, location.search]);

  const onLogin = async (values: any) => {
    dispatch(authActions.login(values));
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
            Login to HCMUS Tour Dashboard
          </Title>
          <Form
            style={{ maxWidth: "400px", width: "100%" }}
            name="admin-login"
            onFinish={onLogin}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!"
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
              name="remember"
              className="aligin-center mt-2"
              valuePropName="checked"
            >
              <Switch defaultChecked className="mr-2" />
              Remember me
            </Form.Item>

            <Divider />
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <p className="font-semibold text-muted mt-1">
              Don't have an account?{" "}
              <Link to="/register" className="text-dark font-bold">
                Register here
              </Link>
            </p>
          </Form>
        </>
      </Row>
    </div>
  );
};

export default Login;
