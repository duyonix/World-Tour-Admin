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
import { cleanObject, goBackInDetailPage } from "@/utils";
import { toast } from "react-toastify";
import ServiceService from "@/services/service";
import variables, { COSTUME_TYPE } from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import RegionSelect from "@/components/RegionSelect";

const { TextArea } = Input;

const ServiceCostumeDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [type, setType] = useState("COMMON");
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Thêm mới");
      form.setFieldsValue({ type: "COMMON" });
    } else {
      fetchDetail();
    }
  }, [dispatch, id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.costume.getCostume(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue({
        ...res.payload,
        regionId: res.payload.regionId ? res.payload.regionId.toString() : null
      });
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
      if (res.payload.model) {
        setModels([
          {
            uid: -1,
            name: "Xem mô hình",
            status: "done",
            url: res.payload.model
          }
        ]);
      }
      setType(res.payload.type);

      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("Trang phục"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("trang phục"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.costume.addCostume(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("trang phục"));
      history.push("/service/costumes");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên trang phục"));
        default:
          return toast.error(messages.CREATE_FAILED("trang phục"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.costume.updateCostume(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("trang phục"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên trang phục"));
        default:
          return toast.error(messages.EDIT_FAILED("trang phục"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const pictureUrl = pictures.length > 0 ? pictures[0].url : "";
    const modelUrl = models.length > 0 ? models[0].url : "";

    if (data.type === "COMMON") {
      delete newData.regionId;
    } else {
      newData.regionId = parseInt(data.regionId);
    }
    newData.picture = pictureUrl;
    newData.model = modelUrl;

    return cleanObject(newData);
  };

  const onSave = data => {
    if (pictures.length === 0) {
      return toast.error("Bắt buộc phải có hình ảnh");
    }
    if (models.length === 0) {
      return toast.error("Bắt buộc phải có mô hình");
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

  const handleModels = useCallback(newModels => {
    setModels(newModels);
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
              label="Tên trang phục"
              rules={[
                {
                  required: true,
                  message: "Tên trang phục là bắt buộc"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="type"
              label="Loại"
              rules={[
                {
                  required: true,
                  message: "Loại là bắt buộc"
                }
              ]}
            >
              <Select
                onChange={value => setType(value)}
                placeholder="Chọn loại trang phục"
                options={Object.keys(COSTUME_TYPE).map(key => ({
                  value: key,
                  label: COSTUME_TYPE[key]
                }))}
              />
            </Form.Item>
            {type === "SPECIFIC" && (
              <Form.Item
                className="mt-2"
                name="regionId"
                label="Địa danh"
                rules={[
                  {
                    required: type === "SPECIFIC",
                    message: "Địa danh là bắt buộc"
                  }
                ]}
              >
                <RegionSelect />
              </Form.Item>
            )}
            <Form.Item name="description" label="Mô tả" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="picture"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Hình ảnh là bắt buộc"
                }
              ]}
            >
              <CustomUpload
                fileList={pictures}
                setFileList={handlePictures}
                disabled={auth.role !== "ADMIN"}
              />
            </Form.Item>
            <Form.Item
              name="model"
              label="Mô hình"
              className="mt-2"
              rules={[
                {
                  required: true,
                  message: "Mô hình là bắt buộc"
                }
              ]}
            >
              <CustomUpload
                fileList={models}
                setFileList={handleModels}
                folder="model"
                accept=".glb"
                textInfo="(Mô hình phải ở định dạng .glb)"
                type="model"
                modelPosition={[0, -10, 0]}
                disabled={auth.role !== "ADMIN"}
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

export default ServiceCostumeDetail;
