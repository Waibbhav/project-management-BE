import { Response } from 'express';
import { CmsService } from './cms.service';
export declare class CmsApiController {
    private cmsService;
    constructor(cmsService: CmsService);
    listSlugs(res: Response): Promise<void>;
    getBySlug(slug: string, res: Response): Promise<void>;
}
