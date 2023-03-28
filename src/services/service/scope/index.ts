import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/scopes";

export default class ServiceScopeService extends BaseService {
  async getScopes(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getScopeOptions() {
    try {
      const res = await super.send("GET", `${PREFIX}/options`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getScope(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async addScope(scope: any) {
    try {
      const res = await super.send("POST", PREFIX, super.header(), scope);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateScope(id: string, scope: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/${id}`,
        super.header(),
        scope
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async deleteScope(id: string) {
    try {
      const res = await super.send("DELETE", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
