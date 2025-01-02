import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UseFilters } from '@nestjs/common/decorators/core/exception-filters.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { AdminAuthFilter } from 'src/helpers';
import { CmsService } from './cms.service';

const fileFieldsInterceptor = FileFieldsInterceptor([], {
    storage: diskStorage({
        destination(req, file, callback) {
            if (!existsSync("./public/uploads/cms")) {
                mkdirSync("./public/uploads/cms");
            }
            callback(null, "./public/uploads/cms")
        },
        filename(req, file, callback) {
            callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        },
    })
})

@ApiExcludeController()
@Controller('cms')
export class CmsController {
    constructor (
        private cmsService: CmsService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('list')
    async userListView(@Req() req: Request, @Res() res: Response) {
        try {
            res.render('cms/list.ejs', {
                page_name: 'cms-management',
                page_title: 'General CMS',
                user: req.user,
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('getall')
    async getAll(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.cmsService.getAll(req);
            res.status(result.status).send(result);
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('update')
    @UseInterceptors(fileFieldsInterceptor)
    async update(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.cmsService.update(req.body);
            req.flash(result.type, result.message);
            res.redirect('/cms/list');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }
}
