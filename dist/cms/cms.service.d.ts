import { CmsRepository } from './repositories';
import { Request } from 'express';
export declare class CmsService {
    private cmsRepo;
    constructor(cmsRepo: CmsRepository);
    getAll(req: Request): Promise<any>;
    update(body: any): Promise<any>;
    getBySlug(slug: string): Promise<any>;
    listAllSlug(): Promise<any>;
}
