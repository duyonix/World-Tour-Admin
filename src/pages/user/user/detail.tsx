import {
  Col,
  Form,
  Row,
  Space,
  Button,
  Input,
  Card,
  Spin,
  Tabs,
  Select
} from "antd";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from "@/layouts/BaseLayout";
import { goBackInDetailPage } from "@/utils";
import { toast } from "react-toastify";
import UserService from "@/services/user";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";

const UserDetailManagement = () => {
  const userService = new UserService();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [role, setRole] = useState<string>("ADMIN");
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const ROLE_OPTIONS = [
    {
      label: "ADMIN",
      value: "ADMIN"
    },
    {
      label: "USER",
      value: "USER"
    }
  ];

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Add");
    } else {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await userService.getUser(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue(res.payload);
      if (res.payload.avatar) {
        setAvatars([
          {
            uid: -1,
            name: "image.jpg",
            status: "done",
            url: res.payload.avatar
          }
        ]);
      }
      if (res.payload.model) {
        setModels([
          {
            uid: -1,
            name: "model.glb",
            status: "done",
            url: res.payload.model
          }
        ]);
      }
      setRole(res.payload.role);
      breadcrumb.addBreadcrumb(res.payload.fullName);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("user"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("user"));
      }
    }
  };

  const onCancel = () => {
    if (!isChange) {
      return goBackInDetailPage(history);
    }
    ConfirmModal({
      title: messages.LEAVE,
      onOk() {
        goBackInDetailPage(history);
      }
    });
  };

  const onSaveRole = async () => {
    setLoading(true);
    const res = await userService.updateRole(id, {
      role
    });
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("role"));
      setIsChange(false);
    } else {
      toast.error(messages.EDIT_FAILED("role"));
    }
  };

  const handleChangeRole = useCallback(value => {
    setRole(value);
    setIsChange(true);
  }, []);

  const itemsTab = [
    {
      label: "General Information",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
            <Form.Item name="fullName" label="Full name" className="mt-2">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="mobileNumber"
              label="Mobile number"
              className="mt-2"
            >
              <Input disabled />
            </Form.Item>

            <Row
              gutter={[16, 16]}
              className="mt-2"
              style={{ alignItems: "end" }}
            >
              <Col flex={1}>
                <Form.Item name="role" label="Role">
                  <Select
                    options={ROLE_OPTIONS}
                    className="w-100"
                    onChange={handleChangeRole}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={onSaveRole}
                  disabled={!isChange}
                >
                  Change
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Form.Item name="avatar" label="Avatar" className="mt-2">
              <CustomUpload
                fileList={avatars}
                setFileList={setAvatars}
                disabled
              />
            </Form.Item>

            <Form.Item name="model" label="Model" className="mt-2">
              <CustomUpload
                fileList={models}
                setFileList={setModels}
                folder="model"
                accept=".glb"
                textInfo="(Model must be in .glb format)"
                type="model"
                modelScale={4}
                modelPosition={[0, -4, 0]}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Spin size="large" style={{ position: "unset" }} spinning={loading}>
      <Card className="m-2 radius-lg mh-card-detail p-relative detail">
        <Form
          layout="vertical"
          form={form}
          className="d-flex fl-wrap fl-column fl-between"
          name="app"
        >
          <Tabs defaultActiveKey="1" className="tab-detail" items={itemsTab} />
        </Form>
        <Space className="text-right mt-auto btn-action">
          <Button className="button" onClick={onCancel} htmlType="button">
            Back
          </Button>
        </Space>
      </Card>
    </Spin>
  );
};

export default UserDetailManagement;
