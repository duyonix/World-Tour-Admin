import React, { useEffect } from "react";
import qs from "query-string";
import { authActions } from "../auth.slice";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import {
  Row,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Switch,
  Spin
} from "antd";
import Earth from "@/assets/images/earth.png";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    const { expired } = qs.parse(location.search);
    if (expired) {
      toast.error(messages.SESSION_EXPIRE);
    }
  }, [dispatch, location.search]);

  const onLogin = async (values: any) => {
    dispatch(authActions.login(values));
  };

  return (
    <Spin spinning={auth.loading} style={{ maxHeight: "none" }} size="large">
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
              style={{ width: "400px", height: "400px" }}
              src={Earth}
              alt="earth"
            />
            <Title level={3} style={{ margin: "0 0px 3vh 0" }}>
              Login to World Tour Dashboard
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
                <Input.Password
                  placeholder="Password"
                  prefix={<KeyOutlined />}
                />
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
    </Spin>
  );
};

export default Login;
