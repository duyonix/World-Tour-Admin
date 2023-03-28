import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/categories";

export default class ServiceCategoryService extends BaseService {
  async getCategories(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getCategory(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async addCategory(category: any) {
    try {
      const res = await super.send("POST", PREFIX, super.header(), category);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateCategory(id: string, category: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/${id}`,
        super.header(),
        category
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async deleteCategory(id: string) {
    try {
      const res = await super.send("DELETE", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
