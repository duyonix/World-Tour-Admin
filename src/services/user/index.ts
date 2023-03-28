import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/users";

export default class UserService extends BaseService {
  async getUsers(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getUser(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
