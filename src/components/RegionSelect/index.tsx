import React, { useState, useEffect, useCallback, memo } from "react";
import _ from "lodash";
import RegionLabel from "./RegionLabel";
import { Select } from "antd";
import ServiceService from "@/services/service";

type Props = {
  value?: string;
  onChange?: any;
  hasOptionAll?: boolean;
  className?: string;
};

const RegionSelect = ({
  value,
  onChange,
  hasOptionAll = false,
  ...restProps
}: Props) => {
  const serviceService = new ServiceService();
  const optionAll = {
    value: "",
    labelSelect: "All",
    label: (
      <RegionLabel
        region={{
          name: "All",
          commonName: "All regions"
        }}
      />
    )
  };
  const [regionOptions, setRegionOptions] = useState(
    hasOptionAll ? [optionAll] : []
  );
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    if (value && !isChange) {
      fetchDetailRegion(value);
    }
  }, [value, isChange]);

  const formatRegionOptions = regions => {
    if (regions && regions.length > 0) {
      const res = regions.map((region: any) => ({
        value: region?.id.toString(),
        labelSelect: region?.name,
        label: <RegionLabel region={region} />
      }));
      if (hasOptionAll) {
        res.unshift(optionAll);
      }
      return res;
    }
    return [];
  };

  const fetchDetailRegion = async (val: string) => {
    const res = await serviceService.region.getRegion(val);
    setRegionOptions(formatRegionOptions([res.payload] || []));
  };

  const getDataRegion = async (val: string) => {
    if (val) {
      const res = await serviceService.region.getRegionOptions({ search: val });
      setRegionOptions(formatRegionOptions(res.payload || []));
    }
  };

  const debounceRegion = useCallback(
    _.debounce(val => {
      getDataRegion(val);
    }, 300),
    []
  );

  const onSearchRegion = (val: string) => {
    debounceRegion(val?.trim());
  };

  const onChangeRegion = (val: string) => {
    setIsChange(true);
    onChange(val);
  };

  return (
    <Select
      onSearch={onSearchRegion}
      onChange={onChangeRegion}
      className={`w-100 ${restProps.className}`}
      showSearch
      options={regionOptions}
      value={value}
      optionLabelProp="labelSelect"
      popupClassName="region-select"
      {...restProps}
    />
  );
};

export default memo(RegionSelect);
