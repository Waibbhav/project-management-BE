import { Injectable } from '@nestjs/common';
import { CmsRepository } from './repositories';
import { Request } from 'express';
const mongoose = require('mongoose');
import * as _ from 'underscore';

@Injectable()
export class CmsService {
    constructor (
        private cmsRepo: CmsRepository
    ) {}

    async getAll(req: Request): Promise<any> {
        try {
            const start = +req.body.start;
            const length = +req.body.length;
            let currentPage = 1;
            if (start>0) {
                currentPage = Math.round((start + length) / length);
            }
            req.body.page = currentPage;
            let cmsData = await this.cmsRepo.getAll(req);
            
            let data = {
                "recordsTotal": cmsData.totalDocs,
                "recordsFiltered": cmsData.totalDocs,
                "data": cmsData.docs
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                data: {
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                },
                message: error.message
            };
        }
    };

    async update(body: any): Promise<any> {
        try {
            const cmsId = mongoose.Types.ObjectId(body.id);
            let cmsData = await this.cmsRepo.getByField({ 'title': body.title, _id: { $ne: cmsId }, isDeleted: false });
            if (_.isEmpty(cmsData)) {
                    if (!body['content']) {
                        return { success: false, type: "error", message: "Content is required." };
                    } else {
                        if (body.slug) {
                            body.slug = body.slug.replace(/\s/g, '');
                            let alreadyExist = await this.cmsRepo.getByField({ 'slug': body.slug, _id: { $ne: cmsId }, isDeleted: false });
                            if (alreadyExist) {
                                return { success: false, type: "error", message: "CMS is already availabe!" };
                            }
                        }

                        let cmsUpdate = await this.cmsRepo.updateById(body, cmsId);
                        if (cmsUpdate && cmsUpdate._id) {
                            return { success: true, type: "success", message: "CMS Updated Successfully" };
                        } else {
                            return { success: false, type: "error", message: "Failed to update CMS content!" };
                        }
                    }
            } else {
                return { success: false, type: "error", message: "CMS is already availabe with same title!" };
            }
        } catch (error) {
            console.error(error);
            return { success: false, type: 'error', message: error.message };
        }
    };

    async getBySlug(slug: string): Promise<any> {
        try {
            const data = await this.cmsRepo.getByFieldWithProjection({ slug: slug, isDeleted: false }, { _id: 0, title: 1, content: 1 });
            if (data) return { success: true, type: 'success', message: "CMS fetched successfully!", data };
            return { success: false, type: 'error', message: "No such page found!", data: null };
        } catch (error) {
            return { success: false, type: 'error', message: error.message, data: null };
        }
    };

    async listAllSlug(): Promise<any> {
        try {
            const data = await this.cmsRepo.getAllByFieldWithProjection({ status: 'Active', isDeleted: false }, { _id: 0, slug: 1, title: 1 });
            if (data) return { success: true, type: 'success', message: "CMS slugs fetched successfully!", data };
            return { success: false, type: 'error', message: "Nothing found!", data: [] };
        } catch (error) {
            return { success: false, type: 'error', message: error.message, data: [] };
        }
    };
}
