import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  // DatePicker,
  Button
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import qs from "query-string";
import styled from "styled-components";
import "./index.scss";
import IconFont from "@/components/IconFont";
import { Moment } from "moment";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { objectToQueryString } from "@/utils";
import { RangeValue } from "rc-picker/lib/interface";

const sizeResponsive = 4;
// const { RangePicker } = DatePicker;
const StyledButton = styled(Button)`
  border-radius: 4px;
  padding: 10px 16px;
`;

const ExportButton = styled(StyledButton)`
  background: #f4f4f4;
`;

// const StyledRangePicker = styled(RangePicker)`
//   height: 42px;
//   width: 100%;
// `;

const StyledSpace = styled(Space)`
  width: 100%;
`;

type Props = {
  filterSelects: {
    label: string;
    name: string;
    options: Option[];
    showSearch?: boolean;
  }[];
  isSearch?: boolean;
  isReset?: boolean;
  isExport?: boolean;
  isDatePicker?: boolean;
  rangeTime?: [string, string];
  placeholder?: string;
  actionReset?: (() => void) | null;
  actionExport?: () => void;
  actionDatePicker?: (value: RangeValue<Moment> | null) => void;
  getValueOnChange?:
    | ((field: { name: string; value: string | number }, form: any) => void)
    | null;
  nameSearch?: string;
  bordered?: boolean;
  position?: "left" | "right";
};

const Filter = ({
  filterSelects = [],
  isSearch = false,
  isReset = false,
  isExport = false,
  isDatePicker = false,
  rangeTime = ["startTime", "endTime"],
  placeholder,
  actionReset = null,
  actionExport,
  actionDatePicker,
  getValueOnChange = null,
  nameSearch = "keyword",
  bordered = true,
  position = "left"
}: Props) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [keySearchTemp, setKeySearchTemp] = useState<string>("");
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const history = useHistory();
  const paramsQuery = qs.parse(location.search);

  useEffect(() => {
    if (Object.keys(paramsQuery).length) {
      // if (isDatePicker) {
      //   paramsQuery.rangeTime = [
      //     paramsQuery[rangeTime[0]] ? moment(paramsQuery[rangeTime[0]]) : null,
      //     paramsQuery[rangeTime[1]] ? moment(paramsQuery[rangeTime[1]]) : null
      //   ];
      // }
      form.setFieldsValue(paramsQuery);
    } else {
      form.resetFields();
    }
    if (isFirst) {
      setIsFirst(false);
    } else form.setFieldsValue({ [nameSearch]: keySearchTemp });
  }, [
    form,
    isDatePicker,
    isFirst,
    keySearchTemp,
    location.search,
    nameSearch,
    paramsQuery,
    rangeTime
  ]);

  const onFilter = (values: {}): void => {
    let newValues = { ...values };
    // if (isDatePicker) {
    //   newValues[rangeTime[0]] =
    //     _.get(values, "rangeTime[0]")?.format("YYYY-MM-DD") || null;
    //   newValues[rangeTime[1]] =
    //     _.get(values, "rangeTime[1]")?.format("YYYY-MM-DD") || null;
    //   delete newValues["rangeTime"];
    // }
    history.push(
      "?" +
        objectToQueryString({
          ...newValues,
          page: 1
        })
    );
  };
  // check how many filterSelects in last row to responsive for Searchbar
  let defaultXsSearch: number = 21;
  let maxFilterSelectsRow: number = 24 / sizeResponsive;
  let reduce: number = filterSelects.length % maxFilterSelectsRow;
  let isDatePickerOnRow: boolean = !(reduce === 5 || reduce === 0);
  let isSearchOnRow: boolean = isDatePicker ? reduce < 3 : reduce < 4;
  const findXsSearch = (): number => {
    if (isDatePicker) {
      if (isDatePickerOnRow) {
        return defaultXsSearch - (reduce < 3 ? 6 : 0);
      } else {
        return defaultXsSearch - 6;
      }
    } else {
      return defaultXsSearch - (reduce < 4 ? reduce * sizeResponsive : 0);
    }
  };
  let xsSearch: number = findXsSearch();
  let xxlSearch: number = xsSearch + 1;
  // const onDatePicker = (values: RangeValue<Moment> | null): void => {
  //   if (actionDatePicker) actionDatePicker(values);
  // };

  const onReset = (): void => {
    actionReset ? actionReset() : history.push(location.pathname);
    form.resetFields();
    setKeySearchTemp("");
  };

  const onExport = (): void => {
    if (actionExport) actionExport();
  };

  const addOptionAll = (list: Option[]): Option[] => {
    return [{ key: -1, value: "", label: "All" }, ...list];
  };

  const onChangeSelect = (name: string, value: string | number) => {
    if (getValueOnChange) {
      return getValueOnChange({ name, value }, form);
    }
    history.push(
      "?" +
        objectToQueryString({
          ...paramsQuery,
          [name]: value,
          page: 1
        })
    );
  };

  return (
    <div className="m-2 radius-xl" style={{ overflow: "hidden" }}>
      <Card bordered={bordered}>
        <Form
          layout="vertical"
          form={form}
          name="control-hooks"
          onFinish={onFilter}
        >
          <Row
            gutter={16}
            style={{
              alignItems: "flex-end",
              justifyContent: position === "left" ? "start" : "end"
            }}
          >
            {filterSelects.map((item, index) => (
              <Col xs={4} key={index} xxl={4}>
                <Form.Item name={item.name} label={item.label} initialValue="">
                  <Select
                    showSearch={item.showSearch ? true : false}
                    options={addOptionAll(item.options)}
                    optionFilterProp="label"
                    onChange={value => onChangeSelect(item.name, value)}
                  />
                </Form.Item>
              </Col>
            ))}
            {/* {isDatePicker && (
              <Col className={isDatePickerOnRow ? "" : "mt-2"} xs={6} xxl={6}>
                <Form.Item name="rangeTime">
                  <StyledRangePicker
                    onChange={onDatePicker}
                    format={"DD/MM/YYYY"}
                  />
                </Form.Item>
              </Col>
            )} */}
            {isSearch && (
              <Col
                className={isSearchOnRow ? "" : "mt-2"}
                xs={xsSearch}
                xxl={xxlSearch}
              >
                <Form.Item name={nameSearch}>
                  <Input.Search
                    onChange={e => setKeySearchTemp(e.target.value)}
                    placeholder={placeholder}
                    className="search-with-icon"
                    enterButton={
                      <Button type="primary" htmlType="submit">
                        <SearchOutlined />
                      </Button>
                    }
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
            )}
            {isReset && (
              <Col xs={3} xxl={2} className="text-right">
                <Form.Item>
                  <StyledSpace className="button-search">
                    {isReset && (
                      <StyledButton htmlType="button" onClick={onReset}>
                        Reset Filter
                      </StyledButton>
                    )}
                  </StyledSpace>
                </Form.Item>
              </Col>
            )}
            {isExport && (
              <Col xs={3} className="text-right">
                <Form.Item>
                  <StyledSpace className="button-search">
                    {isExport && (
                      <ExportButton
                        onClick={onExport}
                        icon={<IconFont type="export-file" />}
                      >
                        <span style={{ marginLeft: "8px" }}>Export</span>
                      </ExportButton>
                    )}
                  </StyledSpace>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Filter;
