import React, { useEffect, useState, memo, createContext } from "react";
import Sidebar from "./Sidebar";
import { Layout, Row, Col } from "antd";
import { Menu, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import avatarDefault from "@/assets/images/avatarDefault.png";
import IconFont from "@/components/IconFont";
import { authActions } from "@/pages/auth/auth.slice";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/hooks";
import AuthService from "@/services/auth";
import { Link, useHistory, useParams } from "react-router-dom";
import ConfirmModal from "@/components/ConfirmModal";
import { RootState } from "@/app/store";
const { Header, Sider, Content } = Layout;

type Props = {
  children: React.ReactNode;
  routeConfig: any;
};

export const BreadcrumbContext = createContext<any>(null);

const BaseLayout = ({ children, routeConfig }: Props) => {
  const breadcrumb = [...routeConfig.breadcrumb];
  const [title, setTitle] = useState<string>("");
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const maxLength = breadcrumb.length - 1;
  const { id } = useParams<{ id: string }>();
  const onLogout = () => {
    const authService = new AuthService();
    authService.logout().then(() => {
      toast.success("Logout Success");
      dispatch(authActions.logoutSuccess());
    });
  };
  useEffect(() => {
    if (!id) setTitle("");
  }, [id, routeConfig]);

  const addBreadcrumb = (name: string) => {
    setTitle(name);
  };

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link
              to="/user/profile"
              className="text-with-icon flex-between color-primary"
            >
              <span>Profile</span>
              <IconFont className="mr-0" type="staff-card" size="1.571em" />
            </Link>
          )
        },
        {
          key: "2",
          label: (
            <div
              onClick={showConfirm}
              className="text-with-icon flex-between color-primary"
            >
              <span>Logout</span>
              <IconFont className="mr-0" type="log-out" size="1.571em" />
            </div>
          )
        }
      ]}
    />
  );

  function showConfirm() {
    ConfirmModal({
      title: "Do you want to logout the page ?",
      onOk() {
        onLogout();
      }
    });
  }

  return (
    <BreadcrumbContext.Provider value={{ addBreadcrumb }}>
      <Layout className="h-100% mh-100vh">
        <Sider width={230} className="sider">
          <Sidebar routeConfig={routeConfig} />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 230 }}>
          <Header className="bg-white p-0">
            <Row className="px-1">
              <Col className="d-flex flex-col line-height" span={20}>
                <strong className="size-medium">World Tour Dashboard</strong>
                <div>
                  {breadcrumb.map((item, index) =>
                    index === maxLength ? (
                      <span key={index} className="text-grey">
                        <span
                          className={title ? "text-grey" : "text-primary"}
                          onClick={() => {
                            history.push(routeConfig.path);
                          }}
                        >
                          {item}
                        </span>
                        {title ? " / " : ""}
                      </span>
                    ) : (
                      <span className={"text-grey"} key={index}>
                        {item} {breadcrumb[index + 1] ? "/ " : ""}
                      </span>
                    )
                  )}
                  {title ? <span className={"text-primary"}>{title}</span> : ""}
                </div>
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Dropdown overlay={menu}>
                  <div
                    className="ant-dropdown-link color-contrast-high"
                    onClick={e => e.preventDefault()}
                  >
                    <Avatar
                      size={40}
                      src={auth?.user?.avatar || avatarDefault}
                    />{" "}
                    <span className="pr-1 pl-1">
                      {auth?.user?.fullName || "Not update"}
                    </span>
                    <CaretDownOutlined />
                  </div>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </BreadcrumbContext.Provider>
  );
};

export default memo(BaseLayout);
