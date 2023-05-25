import BaseService from "../BaseService";
const PREFIX = process.env.SERVER;

export default class CommonService extends BaseService {
  async uploadAttachments(file, folder) {
    try {
      const uri = `${PREFIX}/api/v1/files/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await super.send("POST", uri, super.header(), formData);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async uploadAttachmentFromUrl(url: string) {
    try {
      const uri = `${PREFIX}/api/v1/files/upload-from-url`;
      const res = await super.send("POST", uri, super.header(), { url });
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
