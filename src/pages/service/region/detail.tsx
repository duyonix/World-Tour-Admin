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
  InputNumber,
  Typography
} from "antd";
import React, { useContext, useEffect, useState, useCallback } from "react";
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
import RegionBackgroundTab from "./RegionBackgroundTab";
import RegionSelect from "@/components/RegionSelect";
import RegionSceneSpotTab from "./RegionSceneSpotTab";

const { TextArea } = Input;
const { Title } = Typography;

const ServiceRegionDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const categoryOptions = useAppSelector(
    (state: RootState) => state.service.categoryOptions
  );
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [sceneSpots, setSceneSpots] = useState<any[]>([]);
  const [pictures, setPictures] = useState<any[]>([]);
  const [categoryLevel, setCategoryLevel] = useState<number | null>(null);
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
    dispatch(serviceActions.getCategoryOptions());
  }, [dispatch, id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.region.getRegion(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue({
        ...res.payload,
        categoryId: res.payload.categoryId.toString(),
        parentId: res.payload.parentId?.toString()
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
      setCategoryLevel(res.payload.category?.level);
      setBackgrounds(res.payload.backgrounds);

      if (res.payload.sceneSpots && res.payload.sceneSpots.length > 0) {
        setSceneSpots(res.payload.sceneSpots);
      }

      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("region"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("region"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.region.addRegion(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("region"));
      history.push("/service/regions");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Region name"));
        default:
          return toast.error(messages.CREATE_FAILED("region"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.region.updateRegion(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("region"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Region name"));
        default:
          return toast.error(messages.EDIT_FAILED("region"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const iconUrl = pictures.length > 0 ? pictures[0].url : "";
    newData.picture = iconUrl;

    newData.categoryId = parseInt(data.categoryId);
    if (data.parentId) newData.parentId = parseInt(data.parentId);
    if (categoryLevel !== 4) delete newData.country;

    newData.backgrounds = backgrounds;
    newData.sceneSpots = sceneSpots.map(sceneSpot => {
      if (typeof sceneSpot.id === "string" && sceneSpot.id.includes("temp")) {
        delete sceneSpot.id;
      }
      return sceneSpot;
    });

    return cleanObject(newData);
  };

  const onSave = data => {
    if (pictures.length === 0) {
      return toast.error("Please upload picture");
    }
    if (backgrounds.length === 0) {
      return toast.error("Please upload at least 1 background image");
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

  const handleBackgrounds = useCallback(newBackgrounds => {
    setBackgrounds(newBackgrounds);
    setIsChange(true);
  }, []);

  const handlePictures = useCallback(newPictures => {
    setPictures(newPictures);
    setIsChange(true);
  }, []);

  const handleSceneSpots = useCallback(newSceneSpots => {
    setSceneSpots(newSceneSpots);
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
              label="Region Name"
              rules={[
                {
                  required: true,
                  message: "Region Name is required"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="commonName"
              label="Common Name"
              rules={[
                {
                  required: true,
                  message: "Common Name is required"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="categoryId"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Category is required"
                }
              ]}
            >
              <Select
                placeholder="Select Category"
                optionFilterProp="label"
                className="w-100"
                options={mappingOptions(categoryOptions.data, "id", "name")}
                showSearch
                onChange={value => {
                  const option = categoryOptions.data.find(
                    (category: any) => category.id === parseInt(value)
                  );
                  setCategoryLevel(option?.level || null);
                }}
              />
            </Form.Item>
            <Form.Item className="mt-2" name="parentId" label="Parent Region">
              <RegionSelect
                filter={
                  categoryLevel
                    ? {
                        level: categoryLevel - 1
                      }
                    : {}
                }
              />
            </Form.Item>

            {categoryLevel === 4 && (
              <div className="mt-4">
                <Title level={3}>Country Information</Title>
                <Form.Item
                  name={["country", "code"]}
                  label="Country Code (iso2)"
                  rules={[
                    {
                      required: true,
                      message: "Country Code is required"
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  className="mt-2"
                  name={["country", "capital"]}
                  label="Capital"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="mt-2"
                  name={["country", "language"]}
                  label="Language"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="mt-2"
                  name={["country", "currency"]}
                  label="Currency"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="mt-2"
                  name={["country", "timezone"]}
                  label="Timezone"
                >
                  <Input />
                </Form.Item>
              </div>
            )}
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

            <div className="mt-2">
              <Title level={5} className="mb-0">
                Coordinate
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate", "lattitude"]}
                    label="Latitude"
                    rules={[
                      {
                        required: true,
                        message: "Latitude is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate", "longitude"]}
                    label="Longitude"
                    rules={[
                      {
                        required: true,
                        message: "Longitude is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Row gutter={[16, 16]} className="mt-3">
              <Col span={12}>
                <Form.Item name="area" label="Area (km²)">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="population" label="Population (people)">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="review"
              label="Youtube Review"
              className="mt-2"
              rules={[
                {
                  type: "url",
                  message: "Youtube Review link must be a valid url."
                }
              ]}
            >
              <Input className="text-link" />
            </Form.Item>
            <Form.Item name="description" label="Description" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
      )
    },
    {
      label: "Backgrounds",
      key: "2",
      children: (
        <RegionBackgroundTab
          backgrounds={backgrounds}
          setBackgrounds={handleBackgrounds}
          auth={auth}
        />
      )
    },
    {
      label: "Scene Spots",
      key: "3",
      children: (
        <RegionSceneSpotTab
          sceneSpots={sceneSpots}
          setSceneSpots={handleSceneSpots}
          auth={auth}
        />
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

export default ServiceRegionDetail;
