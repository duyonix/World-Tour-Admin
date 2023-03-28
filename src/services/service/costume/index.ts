import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/costumes";

export default class ServiceCostumeService extends BaseService {
  async getCostumes(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getCostume(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async addCostume(costume: any) {
    try {
      const res = await super.send("POST", PREFIX, super.header(), costume);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateCostume(id: string, costume: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/${id}`,
        super.header(),
        costume
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async deleteCostume(id: string) {
    try {
      const res = await super.send("DELETE", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
