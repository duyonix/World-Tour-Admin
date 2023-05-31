import React from "react";
import { useHistory } from "react-router-dom";
import "./style.scss";
import { Button } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import RegionSelect from "./index";

type Props = {
  value?: string;
  onChange?: any;
  disabled?: boolean;
  filter?: object;
};

const RegionSelectGroup = ({
  value,
  onChange,
  disabled = false,
  filter
}: Props) => {
  const history = useHistory();
  const handleLink = () => {
    if (value) {
      history.push(`/service/regions/${value}`);
    }
  };

  return (
    <div className="d-flex region-select-group">
      <RegionSelect
        onChange={onChange}
        value={value}
        filter={filter}
        disabled={disabled}
        style={{ flexGrow: 1 }}
      />
      <Button
        onClick={handleLink}
        className="form-item-icon"
        icon={
          value ? (
            <EyeFilled style={{ fontSize: "20px" }} />
          ) : (
            <EyeInvisibleFilled style={{ fontSize: "20px" }} />
          )
        }
        disabled={!value}
      />
    </div>
  );
};

export default RegionSelectGroup;
