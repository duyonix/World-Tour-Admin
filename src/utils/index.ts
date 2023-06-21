import qs from "query-string";
import _ from "lodash";
import moment from "moment";

export const objectToQueryString = (obj: {}): string => {
  return new URLSearchParams(cleanObject(obj)).toString();
};

type RoleFeature = {
  app: string;
  feature: string;
  subRoles?: {
    app: string;
    feature: string;
  }[];
};

export const getFeature = (
  listRole: RoleFeature[],
  module: string,
  subModule: string | null = null
): string | string[] | null => {
  if (!subModule) {
    // multi features
    let features = listRole
      .filter(
        (role: RoleFeature) => role.app === "Global" || role.app === module
      )
      .map((role: RoleFeature) => role.feature);
    features = _.uniq(features);
    return features.includes("admin") ? ["admin"] : features;
  } else {
    // with multi-level role the 2'nd role is single feature
    let parentModule = listRole.find(
      (role: RoleFeature) => role.app === module
    );
    if (parentModule) {
      if (parentModule.subRoles && parentModule.subRoles.length) {
        let role = parentModule.subRoles.find(role => role.app === subModule);
        return role ? role.feature : null;
      }
    }
    return null;
  }
};

export const unique = (arr: Option[]): Option[] => {
  let newArr: Option[] = [];
  newArr = arr.filter((item: Option) =>
    newArr.filter((it: Option) => it.value.trim() === item.value.trim()).length
      ? ""
      : newArr.push(item)
  );
  return newArr;
};

export const uniqueFeature = (arr: string[]): string[] => {
  let newArr: string[] = [];
  newArr = arr.filter((item: string) =>
    newArr.filter((it: string) => it.trim() === item.trim()).length
      ? ""
      : newArr.push(item)
  );
  return newArr;
};

export const cleanObject = (obj: {}) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === "" || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

export const changePage = (history: any, page: number): void => {
  let query = qs.parse(window.location.search);
  history.push("?" + objectToQueryString({ ...query, page }));
};

export const goBackInDetailPage = (history: any): void => {
  if (window.history.length > 1) {
    history.goBack();
  } else {
    let current = window.location.pathname;
    history.push(current.substring(0, current.lastIndexOf("/")));
  }
};

export const mappingOptions = (
  originArr: any[],
  value: string | number,
  label: string,
  defaultOptions: any[] = []
): any[] => {
  let options = originArr.map((item: any) => ({
    key: _.uniqueId(),
    value: item[value].toString(),
    label: _.get(item, label, "")
  }));

  defaultOptions.forEach((item: any) => {
    if (item?.value) {
      let exist = options.find((option: any) => option.value === item.value);
      if (!exist) {
        options.push({
          ...item,
          key: _.uniqueId()
        });
      }
    }
  });

  return options;
};

export const getExtensionFile = (filename: string): string => {
  let ext = filename.split(".").pop();
  return ext ? ext.toLowerCase() : "";
};

export const checkExpire = (status: number): boolean => {
  return status === 401 || status === 403;
};

export const createFileName = (preName: string): string => {
  const postName = moment().format("DD-MM-YYYY_HH-mm");
  return `${preName}_${postName}`;
};

export const downloadFile = (
  data: BlobPart,
  filename: string,
  extension: string = "xlsx"
) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.${extension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getJSONFromBlob = async (data: Blob) => {
  let newData = await data.text();
  return JSON.parse(newData);
};

export const parse = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

export const convertTimestampToDate = (timestamp: number) => {
  // convert to UTC+7 with only just time format "hh:mm a"
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: true,
    hour: "numeric",
    minute: "numeric"
  });
};

export const checkPanoramaType = (panorama: string) => {
  if (!panorama) {
    return null;
  }

  const lowercasePanorama = panorama.toLowerCase();
  if (isImage(lowercasePanorama)) {
    return "image";
  } else if (isVideo(lowercasePanorama)) {
    return "video";
  } else {
    return null;
  }
};

const isImage = (panorama: string): boolean => {
  return (
    panorama.endsWith(".jpg") ||
    panorama.endsWith(".jpeg") ||
    panorama.endsWith(".png") ||
    panorama.endsWith(".gif")
  );
};

const isVideo = (panorama: string): boolean => {
  return (
    panorama.endsWith(".mp4") ||
    panorama.endsWith(".avi") ||
    panorama.endsWith(".mov") ||
    panorama.endsWith(".wmv")
  );
};
