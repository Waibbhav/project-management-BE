import { ServiceRepository } from "./repositories";
import { ServiceService } from "./service.service";
export declare class ServiceApiController {
    private serviceService;
    private serviceRepo;
    constructor(serviceService: ServiceService, serviceRepo: ServiceRepository);
}