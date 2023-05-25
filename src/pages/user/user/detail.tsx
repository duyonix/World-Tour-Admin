import { Col, Form, Row, Space, Button, Input, Card, Spin, Tabs } from "antd";
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
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

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
      breadcrumb.addBreadcrumb(res.payload.name);
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

  const handleAvatars = useCallback(newAvatars => {
    setAvatars(newAvatars);
    setIsChange(true);
  }, []);

  const handleModels = useCallback(newModels => {
    setModels(newModels);
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
              <Input />
            </Form.Item>
            <Form.Item name="fullName" label="Full name" className="mt-2">
              <Input />
            </Form.Item>
            <Form.Item
              name="mobileNumber"
              label="Mobile number"
              className="mt-2"
            >
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role" className="mt-2">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="avatar" label="Avatar" className="mt-2">
              <CustomUpload fileList={avatars} setFileList={handleAvatars} />
            </Form.Item>

            <Form.Item name="model" label="Model" className="mt-2">
              <CustomUpload
                fileList={models}
                setFileList={handleModels}
                folder="model"
                accept=".glb"
                textInfo="(Model must be in .glb format)"
                type="model"
                modelScale={4}
                modelPosition={[0, -4, 0]}
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
          onValuesChange={() => {
            setIsChange(true);
          }}
          className="d-flex fl-wrap fl-column fl-between"
          name="app"
          disabled
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
