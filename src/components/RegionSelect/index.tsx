import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo
} from "react";
import debounce from "lodash/debounce";
import RegionLabel from "./RegionLabel";
import { Select, Spin, Empty } from "antd";
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
          name: "All"
        }}
      />
    )
  };
  const [options, setOptions] = useState(hasOptionAll ? [optionAll] : []);
  const [fetching, setFetching] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const fetchRef = useRef(0);

  useEffect(() => {
    if (value && !isChange) {
      fetchDetail(value);
    }
  }, [value, isChange]);

  const formatOptions = (regions: any[]) => {
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

  const fetchDetail = async (val: string) => {
    const res = await serviceService.region.getRegion(val);
    setOptions(formatOptions([res.payload] || []));
  };

  const fetchOptions = async (val: string) => {
    if (val) {
      const res = await serviceService.region.getRegionOptions({ search: val });
      return formatOptions(res.payload || []);
    }
    return [];
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (val: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(val).then((data: any) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(data);
        setFetching(false);
      });
    };

    return debounce(loadOptions, 800);
  }, []);

  const onChangeRegion = (val: string) => {
    setIsChange(true);
    onChange(val);
  };

  return (
    <Select
      onSearch={debounceFetcher}
      onChange={onChangeRegion}
      className={`w-100 ${restProps.className}`}
      showSearch
      options={options}
      value={value}
      filterOption={false}
      optionLabelProp="labelSelect"
      popupClassName="region-select"
      notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
      placeholder="Type to search region"
      {...restProps}
    />
  );
};

export default memo(RegionSelect);
