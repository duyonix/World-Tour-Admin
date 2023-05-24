import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/regions";

export default class ServiceRegionService extends BaseService {
  async getRegions(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getRegionOptions() {
    try {
      const res = await super.send("GET", `${PREFIX}/options`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getRegion(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async addRegion(region: any) {
    try {
      const res = await super.send("POST", PREFIX, super.header(), region);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateRegion(id: string, region: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/${id}`,
        super.header(),
        region
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async deleteRegion(id: string) {
    try {
      const res = await super.send("DELETE", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
