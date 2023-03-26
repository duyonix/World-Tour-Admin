import BaseService from "../BaseService";
const PREFIX = process.env.SERVER;

export default class AuthService extends BaseService {
  async register(data: any) {
    try {
      const res = await super.send("POST", `${PREFIX}/register`, null, data);
      return res?.data || res;
    } catch (err: any) {
      return err?.response.data;
    }
  }

  async login(data: any) {
    try {
      const res = await super.send(
        "POST",
        `${PREFIX}/authenticate`,
        null,
        data
      );
      return res?.data || res;
    } catch (err: any) {
      return err?.response.data;
    }
  }

  async logout() {
    try {
      const res = await super.send("GET", `${PREFIX}/logout`, super.header());
      if (res.status === 200) {
        localStorage.clear();
      }
    } catch (err: any) {
      return err?.response.data;
    }
  }
}
