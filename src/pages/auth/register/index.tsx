import React, { useState } from "react";
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
  Checkbox,
  Spin
} from "antd";
import Earth from "@/assets/images/earth.png";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import AuthService from "@/services/auth";

const { Title } = Typography;

const Register = () => {
  const authService = new AuthService();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

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
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    const res = await authService.register(formatData(values));
    if (res.status === variables.OK) {
      toast.success("Đăng ký tài khoản thành công!");
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
    setLoading(false);
  };

  return (
    <Spin spinning={loading} style={{ maxHeight: "none" }} size="large">
      <div className="auth-page">
        <Row
          justify="center"
          align="middle"
          style={{ flexDirection: "column", flex: 1 }}
        >
          <>
            <iframe
              title="earth"
              src="https://solarsystem.nasa.gov/gltf_embed/2393"
              width="400px"
              height="400px"
              frameBorder="0"
              style={{ borderRadius: "50%" }}
            />
            <Title
              level={3}
              style={{ margin: "0 0px 3vh 0", color: "#ffffff" }}
            >
              Đăng ký vào World Tour Dashboard
            </Title>
            <Form
              style={{
                maxWidth: "400px",
                width: "100%",
                background: "rgba(0,0,0,0.3)"
              }}
              name="admin-login"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!"
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!"
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
                    message: "Vui lòng nhập mật khẩu!"
                  }
                ]}
              >
                <Input.Password
                  placeholder="Mật khẩu"
                  prefix={<KeyOutlined />}
                />
              </Form.Item>

              <Form.Item
                className="mt-2"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu!"
                  }
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  prefix={<KeyOutlined />}
                />
              </Form.Item>

              <Row gutter={16} className="mt-2">
                <Col md={12}>
                  <Form.Item
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ!"
                      }
                    ]}
                  >
                    <Input placeholder="Họ" />
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên!"
                      }
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="mt-2" name="mobileNumber">
                <Input placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mt-2"
              >
                <Checkbox>
                  <span style={{ color: "#ffffff" }}>
                    Tôi đồng ý với{" "}
                    <a href="#register" className="font-bold">
                      Điều khoản sử dụng
                    </a>
                  </span>
                </Checkbox>
              </Form.Item>

              <Divider />
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="font-bold"
                >
                  ĐĂNG KÝ
                </Button>
              </Form.Item>
              <p className="font-semibold mt-1" style={{ color: "#ffffff" }}>
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-bold">
                  Đăng nhập tại đây
                </Link>
              </p>
            </Form>
          </>
        </Row>
      </div>
    </Spin>
  );
};

export default Register;
