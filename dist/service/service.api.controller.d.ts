import { Response, Request } from "express";
import { CreateServiceDTO } from "./dto";
import { ServiceRepository } from "./repositories";
import { ServiceService } from "./service.service";
export declare class ServiceApiController {
    private serviceService;
    private serviceRepo;
    constructor(serviceService: ServiceService, serviceRepo: ServiceRepository);
    createService(dto: CreateServiceDTO, req: Request, res: Response): Promise<void>;
}
