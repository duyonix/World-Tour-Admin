import axios from "axios";
import { checkExpire } from "@/utils";
import _ from "lodash";
// import errorCodes from "@/constants/errorCodes";
import AuthService from "@/services/auth";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export default class BaseService {
  send(
    method: Method,
    url: string,
    headers: any = null,
    data: any = null,
    params: any = null,
    responseType: any = "json"
  ) {
    return axios({
      method,
      url,
      headers,
      data,
      params,
      responseType
    });
  }

  header() {
    let token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  errorResponse(err: any) {
    if (err.response) {
      if (checkExpire(err.response.status)) {
        const authService = new AuthService();
        authService.logout().then(() => {
          window.location.href = "/login?expired=true";
        });
      }
      return err.response?.data || {};
    }
    return err.message;
  }
}
