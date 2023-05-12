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
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from "@/layouts/BaseLayout";
import { cleanObject, goBackInDetailPage, mappingOptions } from "@/utils";
import { toast } from "react-toastify";
import ServiceService from "@/services/service";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { serviceActions } from "../service.slice";

const { TextArea } = Input;

const ServiceCostumeDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const scopeOptions = useAppSelector(
    (state: RootState) => state.service.scopeOptions
  );
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();
  const [defaultScope, setDefaultScope] = useState<any>(null);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Add");
    } else {
      fetchDetail();
    }
    dispatch(serviceActions.getScopeOptions());
  }, [dispatch, id]);

  const allScopeOptions = useMemo(
    () => mappingOptions(scopeOptions.data, "id", "name", [scopeOptions]),
    [scopeOptions.data, defaultScope]
  );

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.costume.getCostume(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue({
        ...res.payload,
        scopeId: res.payload.scopeId.toString()
      });
      if (res.payload.picture) {
        setPictures([
          {
            uid: -1,
            name: "image.jpg",
            status: "done",
            url: res.payload.picture
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
      setDefaultScope({
        value: res.payload.scope.id.toString(),
        label: res.payload.scope.name
      });

      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("costume"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("costume"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.costume.addCostume(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("costume"));
      history.push("/service/costumes");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Costume name"));
        default:
          return toast.error(messages.CREATE_FAILED("costume"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.costume.updateCostume(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("costume"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Costume name"));
        default:
          return toast.error(messages.EDIT_FAILED("costume"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const pictureUrl = pictures.length > 0 ? pictures[0].url : "";
    const modelUrl = models.length > 0 ? models[0].url : "";

    newData.scopeId = parseInt(data.scopeId);
    newData.picture = pictureUrl;
    newData.model = modelUrl;

    return cleanObject(newData);
  };

  const onSave = data => {
    if (pictures.length === 0) {
      return toast.error("Please upload picture");
    }
    if (models.length === 0) {
      return toast.error("Please upload model");
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
      label: "General Information",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="name"
              label="Costume Name"
              rules={[
                {
                  required: true,
                  message: "Costume Name is required"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="scopeId"
              label="Scope"
              rules={[
                {
                  required: true,
                  message: "Scope is required"
                }
              ]}
            >
              <Select
                placeholder="Select scope"
                optionFilterProp="label"
                className="w-100"
                options={allScopeOptions}
                showSearch
              />
            </Form.Item>
            <Form.Item name="description" label="Description" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="picture"
              label="Picture"
              rules={[
                {
                  required: true,
                  message: "Picture is required"
                }
              ]}
            >
              <CustomUpload fileList={pictures} setFileList={handlePictures} />
            </Form.Item>
            <Form.Item
              name="model"
              label="Model"
              className="mt-2"
              rules={[
                {
                  required: true,
                  message: "Model is required"
                }
              ]}
            >
              <CustomUpload
                fileList={models}
                setFileList={handleModels}
                accept=".glb"
                textInfo="(Model must be in .glb format)"
                type="model"
                modelPosition={[0, -10, 0]}
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
            Back
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isChange}
              className="button"
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Save
            </Button>
          )}
        </Space>
      </Card>
    </Spin>
  );
};

export default ServiceCostumeDetail;
