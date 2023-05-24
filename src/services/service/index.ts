import ServiceCategoryService from "./category";
import ServiceRegionService from "./region";
import ServiceCostumeService from "./costume";

export default class ServiceService {
  category = new ServiceCategoryService();
  region = new ServiceRegionService();
  costume = new ServiceCostumeService();
}
