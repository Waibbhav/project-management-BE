import { Response, Request } from 'express';
import { CmsService } from './cms.service';
export declare class CmsController {
    private cmsService;
    constructor(cmsService: CmsService);
    userListView(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
}
