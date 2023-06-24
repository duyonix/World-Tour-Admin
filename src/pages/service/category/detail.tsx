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
  Select,
  InputNumber
} from "antd";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from "@/layouts/BaseLayout";
import { cleanObject, goBackInDetailPage } from "@/utils";
import { toast } from "react-toastify";
import ServiceService from "@/services/service";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";

const { TextArea } = Input;
const CATEGORY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ServiceCategoryDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState<any[]>([]);
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Thêm mới");
    } else {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.category.getCategory(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue(res.payload);
      if (res.payload.picture) {
        setPictures([
          {
            uid: -1,
            name: "Xem hình ảnh",
            status: "done",
            url: res.payload.picture
          }
        ]);
      }
      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("Phân loại"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("phân loại"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.category.addCategory(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("phân loại"));
      history.push("/service/categories");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên phân loại"));
        case variables.DUPLICATE_LEVEL:
          return toast.error(messages.EXISTED("Cấp độ phân loại"));
        default:
          return toast.error(messages.CREATE_FAILED("phân loại"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.category.updateCategory(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("phân loại"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên phân loại"));
        case variables.DUPLICATE_LEVEL:
          return toast.error(messages.EXISTED("Cấp độ phân loại"));
        default:
          return toast.error(messages.EDIT_FAILED("phân loại"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const iconUrl = pictures.length > 0 ? pictures[0].url : "";
    newData.picture = iconUrl;

    return cleanObject(newData);
  };

  const onSave = data => {
    if (pictures.length === 0) {
      return toast.error("Bắt buộc có hình ảnh");
    }
    const newData = convertData(data);
    if (id === "add") {
      create(newData);
    } else {
      update(newData);
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

  const handlePictures = useCallback(newPictures => {
    setPictures(newPictures);
    setIsChange(true);
  }, []);

  const itemsTab = [
    {
      label: "Thông tin chung",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên phân loại"
              rules={[
                {
                  required: true,
                  message: "Tên phân loại là bắt buộc"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level"
              label="Cấp độ"
              rules={[
                {
                  required: true,
                  message: "Cấp độ là bắt buộc"
                }
              ]}
            >
              <Select
                placeholder="Chọn cấp độ"
                className="w-100"
                options={CATEGORY_LEVELS.map(level => ({
                  label: level,
                  value: level
                }))}
              />
            </Form.Item>
            <Form.Item
              name="picture"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Hình ảnh là bắt buộc"
                }
              ]}
              className="mt-2"
            >
              <CustomUpload
                fileList={pictures}
                setFileList={handlePictures}
                disabled={auth.role !== "ADMIN"}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
      forceRender: true
    }
  ];

  if (auth.role === "ADMIN") {
    itemsTab.push({
      label: "Thông số thiết lập",
      key: "2",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="zoomFactor"
              label="Độ thu phóng tầm nhìn"
              rules={[
                {
                  required: true,
                  message: "Độ thu phóng tầm nhìn là bắt buộc"
                }
              ]}
            >
              <InputNumber className="w-100 input-number-custom" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="scaleFactor"
              label="Độ thu phóng Trái Đất"
              rules={[
                {
                  required: true,
                  message: "Độ thu phóng Trái Đất là bắt buộc"
                }
              ]}
            >
              <InputNumber className="w-100 input-number-custom" />
            </Form.Item>
          </Col>
        </Row>
      ),
      forceRender: true
    });
  }

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
          onFinish={onSave}
          disabled={auth.role !== "ADMIN"}
        >
          <Tabs defaultActiveKey="1" className="tab-detail" items={itemsTab} />
        </Form>
        <Space className="text-right mt-auto btn-action">
          <Button className="button" onClick={onCancel} htmlType="button">
            Quay về
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isChange}
              className="button"
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Lưu
            </Button>
          )}
        </Space>
      </Card>
    </Spin>
  );
};

export default ServiceCategoryDetail;
