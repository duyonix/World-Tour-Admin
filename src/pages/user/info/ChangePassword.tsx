import React, { useState } from "react";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import { Row, Col, Form, Input, Button, Divider, Checkbox } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import UserService from "@/services/user";
import AuthService from "@/services/auth";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { authActions } from "@/pages/auth/auth.slice";

type Props = {
  email: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const ChangePassword = ({ email, loading, setLoading }: Props) => {
  const userService = new UserService();
  const authService = new AuthService();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [form] = Form.useForm();

  const formatData = (data: any) => {
    return {
      email,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
  };

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("New password and confirm password are not the same");
      return;
    }
    setLoading(true);
    const res = await userService.updatePassword(formatData(values));
    if (res.status === variables.OK) {
      toast.success("Change password successfully! Please login again");
      authService.logout().then(() => {
        setTimeout(() => {
          dispatch(authActions.logoutSuccess());
        }, 1000);
      });
    } else {
      if (res.status === variables.NOT_MATCH) {
        toast.error("Old password is not correct");
      } else {
        toast.error(messages.EXCEPTION);
      }
    }
    setLoading(false);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ flexDirection: "column", flex: 1 }}
    >
      <>
        <Form
          form={form}
          layout="vertical"
          name="change-password"
          onValuesChange={() => {
            setIsChange(true);
          }}
          onFinish={onFinish}
        >
          <Form.Item
            className="mt-2"
            name="oldPassword"
            label="Old password"
            rules={[
              {
                required: true,
                message: "Enter your old password!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          <Form.Item
            className="mt-2"
            name="newPassword"
            label="New password"
            rules={[
              {
                required: true,
                message: "Enter your new password!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          <Form.Item
            className="mt-2"
            name="confirmPassword"
            label="Confirm password"
            rules={[
              {
                required: true,
                message: "Re-enter your new password!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
        </Form>

        <Button
          disabled={!isChange}
          className="button mt-3"
          type="primary"
          htmlType="submit"
          onClick={() => form.submit()}
        >
          Update Password
        </Button>
      </>
    </Row>
  );
};

export default ChangePassword;
