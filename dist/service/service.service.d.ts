import { ServiceRepository } from "./repositories";
import { MailerService, UtilsService } from "src/helpers";
export declare class ServiceService {
    private userRepo;
    private mailerService;
    private utilsService;
    constructor(userRepo: ServiceRepository, mailerService: MailerService, utilsService: UtilsService);
}
