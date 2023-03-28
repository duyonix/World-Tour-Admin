import ServiceCategoryService from "./category";
import ServiceScopeService from "./scope";
import ServiceCostumeService from "./costume";

export default class ServiceService {
  category = new ServiceCategoryService();
  scope = new ServiceScopeService();
  costume = new ServiceCostumeService();
}
