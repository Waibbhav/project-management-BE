import { CreateServiceDTO } from "./dto";
import { ServiceRepository } from "./repositories";
import { MailerService, UtilsService } from "src/helpers";
export declare class ServiceService {
    private serviceRepo;
    private mailerService;
    private utilsService;
    constructor(serviceRepo: ServiceRepository, mailerService: MailerService, utilsService: UtilsService);
    createService(body: CreateServiceDTO, files: any): Promise<any>;
}
