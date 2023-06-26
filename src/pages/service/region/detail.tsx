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
  Typography,
  Tooltip
} from "antd";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
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
import RegionSceneSpotTab from "./RegionSceneSpotTab";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./style.scss";
import RegionWeatherTab from "./RegionWeatherTab";
import ReviewInput from "@/components/ReviewInput";
import RegionSelectGroup from "@/components/RegionSelect/RegionSelectGroup";
import RegionTour from "./RegionTour";

const { TextArea } = Input;
const { Title, Text } = Typography;

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
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [categoryLevel, setCategoryLevel] = useState<number | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
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
    if (firstRender) {
      dispatch(serviceActions.getCategoryOptions());
      setFirstRender(false);
    }
  }, [dispatch, id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.region.getRegion(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue({
        ...res.payload,
        categoryId: res.payload.categoryId.toString(),
        parentId: res.payload.parentId?.toString(),
        area: res.payload.area || null,
        population: res.payload.population || null,
        review: res.payload.review || null,
        description: res.payload.description || null
      });
      setData(res.payload);

      if (res.payload.picture) {
        setPictures([
          {
            uid: -1,
            name: "Xem hình ảnh",
            status: "done",
            url: res.payload.picture
          }
        ]);
      } else setPictures([]);
      if (res.payload.panorama) {
        setPanoramas([
          {
            uid: -1,
            name: "Xem ảnh/video toàn cảnh 360 độ",
            status: "done",
            url: res.payload.panorama
          }
        ]);
      } else setPanoramas([]);
      if (res.payload.model) {
        setModels([
          {
            uid: -1,
            name: "Xem mô hình 3D",
            status: "done",
            url: res.payload.model
          }
        ]);
      } else setModels([]);

      setCategoryLevel(res.payload.category?.level || null);
      setBackgrounds(res.payload.backgrounds || []);
      setSceneSpots(res.payload.sceneSpots || []);

      setIsChange(false);
      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("Địa danh"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("địa danh"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.region.addRegion(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("địa danh"));
      history.push("/service/regions");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên địa danh"));
        case variables.NOT_SUITABLE:
          return toast.error(messages.NOT_SUITABLE("Địa danh trực thuộc"));
        default:
          return toast.error(messages.CREATE_FAILED("địa danh"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.region.updateRegion(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("địa danh"));
      fetchDetail();
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên địa danh"));
        case variables.NOT_SUITABLE:
          return toast.error(messages.NOT_SUITABLE("Địa danh trực thuộc"));
        default:
          return toast.error(messages.EDIT_FAILED("địa danh"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const iconUrl = pictures.length > 0 ? pictures[0].url : null;
    newData.picture = iconUrl;
    const modelUrl = models.length > 0 ? models[0].url : null;
    newData.model = modelUrl;

    newData.categoryId = parseInt(data.categoryId);
    if (data.parentId) newData.parentId = parseInt(data.parentId);
    if (categoryLevel !== 4) delete newData.country;

    newData.backgrounds = backgrounds;
    newData.sceneSpots = sceneSpots.map(sceneSpot => {
      if (typeof sceneSpot.id === "string" && sceneSpot.id.includes("temp")) {
        delete sceneSpot.id;
      }
      delete sceneSpot.reviewInfo;
      return sceneSpot;
    });

    const panoramaUrl = panoramas.length > 0 ? panoramas[0].url : null;
    newData.panorama = panoramaUrl;

    return cleanObject(newData);
  };

  const onSave = data => {
    if (pictures.length === 0) {
      return toast.error("Bắt buộc phải có hình ảnh");
    }
    if (backgrounds.length === 0) {
      return toast.error("Bắt buộc có ít nhất 1 hình nền");
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

  const handlePanoramas = useCallback(newPanoramas => {
    setPanoramas(newPanoramas);
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
              label="Tên địa danh"
              rules={[
                {
                  required: true,
                  message: "Tên địa danh là bắt buộc"
                }
              ]}
            >
              <Input disabled={auth.role !== "ADMIN"} />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="commonName"
              label="Tên gọi chung"
              rules={[
                {
                  required: true,
                  message: "Tên gọi chung là bắt buộc"
                }
              ]}
            >
              <Input disabled={auth.role !== "ADMIN"} />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="categoryId"
              label="Phân loại"
              rules={[
                {
                  required: true,
                  message: "Phân loại là bắt buộc"
                }
              ]}
            >
              <Select
                placeholder="Chọn phân loại"
                optionFilterProp="label"
                className="w-100"
                options={mappingOptions(categoryOptions.data, "id", "name")}
                onChange={value => {
                  const option = categoryOptions.data.find(
                    (category: any) => category.id === parseInt(value)
                  );
                  setCategoryLevel(option?.level || null);
                }}
                disabled={auth.role !== "ADMIN"}
              />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="parentId"
              label="Địa danh trực thuộc"
              rules={[
                {
                  required: categoryLevel !== null && categoryLevel !== 1,
                  message: "Địa danh trực thuộc là bắt buộc"
                }
              ]}
            >
              <RegionSelectGroup
                filter={
                  categoryLevel
                    ? {
                        level: categoryLevel - 1
                      }
                    : {}
                }
                disabled={auth.role !== "ADMIN"}
              />
            </Form.Item>

            {categoryLevel === 4 && (
              <div style={{ marginTop: "25px" }}>
                <Title level={4} className="text-primary">
                  Thông tin Quốc gia
                </Title>
                <Row gutter={[16, 16]} className="mt-2">
                  <Col span={12}>
                    <Form.Item
                      name={["country", "code"]}
                      label="Mã đất nước (iso2)"
                      rules={[
                        {
                          required: true,
                          message: "Mã đất nước là bắt buộc"
                        }
                      ]}
                    >
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["country", "tld"]} label="Tên miền">
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} className="mt-2">
                  <Col span={12}>
                    <Form.Item name={["country", "capital"]} label="Thủ đô">
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["country", "language"]} label="Ngôn ngữ">
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} className="mt-2">
                  <Col span={12}>
                    <Form.Item name={["country", "currency"]} label="Tiền tệ">
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["country", "timezone"]} label="Múi giờ">
                      <Input disabled={auth.role !== "ADMIN"} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {id !== "add" && data.neighbors && data.neighbors.length > 0 && (
              <div className="mt-4">
                <Title level={4} className="text-primary">
                  Địa danh lân cận
                </Title>
                <Row gutter={[16, 16]}>
                  {data.neighbors?.map((neighbor: any) => (
                    <Col span={8} key={neighbor.id}>
                      <Link to={`/service/regions/${neighbor.id}`}>
                        <Tooltip
                          title={`${neighbor.name} (${neighbor.commonName})`}
                        >
                          <Card
                            hoverable
                            className="region-card"
                            cover={
                              <img alt={neighbor.name} src={neighbor.picture} />
                            }
                          ></Card>
                        </Tooltip>
                      </Link>
                      <Title level={5} className="text-center text-limit">
                        {neighbor.name}
                      </Title>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {data.hasChildren && (
              <div className="mt-4">
                <Link
                  to={`/service/regions?parentId=${id}`}
                  className="animation-link"
                >
                  <DoubleRightOutlined /> Xem tất cả địa danh con trực thuộc
                </Link>
              </div>
            )}
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

            <div className="mt-2">
              <Title level={5} className="mb-0">
                Tọa độ
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate", "lattitude"]}
                    label="Vĩ độ"
                    rules={[
                      {
                        required: true,
                        message: "Vĩ độ là bắt buộc"
                      }
                    ]}
                  >
                    <InputNumber
                      className="w-100 input-number-custom"
                      disabled={auth.role !== "ADMIN"}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate", "longitude"]}
                    label="Kinh độ"
                    rules={[
                      {
                        required: true,
                        message: "Kinh độ là bắt buộc"
                      }
                    ]}
                  >
                    <InputNumber
                      className="w-100 input-number-custom"
                      disabled={auth.role !== "ADMIN"}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Row gutter={[16, 16]} className="mt-3">
              <Col span={12}>
                <Form.Item name="area" label="Diện tích (km²)">
                  <InputNumber
                    className="w-100 input-number-custom"
                    disabled={auth.role !== "ADMIN"}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="population" label="Dân số (người)">
                  <InputNumber
                    className="w-100 input-number-custom"
                    disabled={auth.role !== "ADMIN"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="review"
              label="Youtube Review"
              rules={[
                {
                  type: "url",
                  message: "Đường dẫn không hợp lệ"
                }
              ]}
              className="mt-2"
            >
              <ReviewInput disabled={auth.role !== "ADMIN"} />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" className="mt-2">
              <TextArea rows={5} disabled={auth.role !== "ADMIN"} />
            </Form.Item>
          </Col>
        </Row>
      )
    },
    {
      label: "Hình nền",
      key: "2",
      children: (
        <RegionBackgroundTab
          backgrounds={backgrounds}
          setBackgrounds={handleBackgrounds}
          auth={auth}
        />
      ),
      forceRender: true
    },
    {
      label: "Du lịch",
      key: "3",
      children: (
        <RegionSceneSpotTab
          sceneSpots={sceneSpots}
          setSceneSpots={handleSceneSpots}
          auth={auth}
        />
      ),
      forceRender: true
    },
    {
      label: "360 Tour",
      key: "4",
      children: (
        <RegionTour
          coordinate={data.coordinate || {}}
          hasStreetView={data.hasStreetView}
          panoramas={panoramas}
          setPanoramas={handlePanoramas}
          models={models}
          setModels={handleModels}
          auth={auth}
          id={id}
        />
      )
      // forceRender: true
    }
  ];

  if (id !== "add" && data.weather) {
    itemsTab.push({
      label: "Thời tiết",
      key: "5",
      children: <RegionWeatherTab weather={data.weather} />,
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

export default ServiceRegionDetail;
