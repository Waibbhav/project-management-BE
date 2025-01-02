import { Body, Controller, Get, Param, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { HttpExceptionFilter } from 'src/helpers';
import { CmsService } from './cms.service';

@ApiTags('CMS')
@Controller('api/cms')
export class CmsApiController {
    constructor (
        private cmsService: CmsService
    ) {}

    @Get('list-slugs')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: "List All CMS Available Slugs", description: "Get all available CMS page slugs." })
    @ApiResponse({ status: 200, description: 'CMS slugs fetched successfully!'})
    @ApiResponse({ status: 404, description: 'Nothing found!'})
    @UseFilters(HttpExceptionFilter)
    async listSlugs (@Res() res: Response) {
        try {
            const result = await this.cmsService.listAllSlug();
            if (result.success) {
                res.status(200).json({ status: 200, data: result.data, message: result.message });
            } else {
                res.status(404).json({ status: 404, data: result.data, message: result.message });
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: [],
                message: error.message,
            });
        }
    };

    @Get('content/:slug')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: "CMS Content By Slug", description: "Get CMS page content by slug in url/path" })
    @ApiResponse({ status: 200, description: 'CMS fetched successfully!'})
    @ApiResponse({ status: 404, description: 'No such page found!'})
    @UseFilters(HttpExceptionFilter)
    async getBySlug (@Param('slug') slug: string, @Res() res: Response) {
        try {
            const result = await this.cmsService.getBySlug(slug);
            if (result.success) {
                res.status(200).json({ status: 200, data: result.data, message: result.message });
            } else {
                res.status(404).json({ status: 404, data: result.data, message: result.message });
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: error.message,
            });
        }
    };
}
