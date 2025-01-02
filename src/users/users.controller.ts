import { Body, Controller, Get, Post, Req, Res, ForbiddenException } from '@nestjs/common';
import { UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UseFilters } from '@nestjs/common/decorators/core/exception-filters.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

import { AdminAuthFilter } from 'src/helpers';
import { AdminAccountDTO, AdminChangePasswordDTO, ChangePwdDTO, ForgetPwdDTO, SigninDTO, UserCreateFromAdminDTO } from './dto';
import { UserRepository } from './repositories';
import { UsersService } from './users.service';

const fileFieldsInterceptor = FileFieldsInterceptor([
    { name: 'profile_image', maxCount: 1 },
], {
    storage: diskStorage({
        destination(req, file, callback) {
            if (!existsSync("./public/uploads/user")) {
                mkdirSync("./public/uploads/user");
            }
            callback(null, "./public/uploads/user")
        },
        filename(req, file, callback) {
            callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        },
    })
})

@ApiExcludeController()
@Controller()
export class UsersController {
    constructor(
        private userService: UsersService,
   
        private userRepo: UserRepository
    ) {}

    @Get()
    async loginScreen(@Req() req: Request, @Res() res: Response) {
        try {
            req.session && req.session['token'] && res.redirect('/dashboard');
            (!req.session || !req.session['token']) && res.render('users/login.ejs', {});
        } catch (error) {
            console.error(error);
            throw new ForbiddenException(error.message);
        }
    }

    @Post('signin')
    async signin(@Body() dto: SigninDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.signin(dto);
            req.flash(result.type, result.message);
            result.success && ((req.session['token'] = result.data.token) && res.redirect('/dashboard'));
            !result.success && (res.redirect('/'));
        } catch (error) {
            console.error(error, 'error signin');
            throw new ForbiddenException(error.message);
        }
    };

    @Post('forget-password')
    async forgetPassword(@Body() dto: ForgetPwdDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.forgetPassword(dto, 'backend');
            req.flash(result.type, result.message);
            res.redirect('/');
        } catch (error) {
            console.error(error, 'error signin');
            throw new ForbiddenException(error.message);
        }
    };

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('dashboard')
    async dashboard(@Req() req: Request, @Res() res: Response) {
        try {
            const stats = await this.userService.dashboardPageStats();

            res.render('users/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                stats
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            req.session.destroy(function (err) {
                res.redirect('/');
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('account')
    async account(@Req() req: Request, @Res() res: Response) {
        try {
            res.render('users/admin-account.ejs', {
                page_name: 'admin-account',
                page_title: 'Account',
                user: req.user,
                response: req.user,
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('account')
    @UseInterceptors(fileFieldsInterceptor)
    async accountSubmit(@UploadedFiles() files: Express.Multer.File[], @Body() dto: AdminAccountDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.accountSubmit(dto, files, req.user);
            req.flash(result.type, result.message);
            result.success && res.redirect('/dashboard');
            !result.success && res.redirect('/account');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('settings')
    async settings(@Req() req: Request, @Res() res: Response) {
        try {
            res.render('users/admin-security.ejs', {
                page_name: 'admin-security',
                page_title: 'Settings',
                user: req.user,
                response: req.user,
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('change-password')
    async adminChangePasswordSubmit(@Body() dto: AdminChangePasswordDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.adminChangePasswordSubmit(dto, req.user);
            req.flash(result.type, result.message);
            result.success && res.redirect('/dashboard');
            !result.success && res.redirect('/settings');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/list')
    async userListView(@Req() req: Request, @Res() res: Response) {
        try {
            const stats = await this.userService.userListPageStats();
            res.render('users/list.ejs', {
                page_name: 'user-management',
                page_title: 'Buyers',
                user: req.user,
                stats,
              
            });
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('users/getall')
    async getAllUser(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.getAllUser(req);
            res.status(result.status).send(result);
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/dashboard');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('/users/store')
    @UseInterceptors(fileFieldsInterceptor)
    async userStore(@UploadedFiles() files: Express.Multer.File[], @Body() dto: UserCreateFromAdminDTO, @Req() req: Request, @Res() res: Response) {
        try {
            console.log(dto);
            const result = await this.userService.userCreateFromAdmin(dto, files);
            req.flash(result.type, result.message);
            result.success && res.redirect('/users/view/' + result.data._id);
            !result.success && res.redirect('/users/list');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/status-change/:id')
    async statusChange(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.statusChange(req.params.id, req.query.status as string);
            req.flash(result.type, result.message);
            req.query.path ? res.redirect(<string>req.query.path):res.redirect('/users/list');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/delete/:id')
    async deleteAccount(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.deleteAccount(req.params.id);
            req.flash(result.type, result.message);
            res.redirect('/users/list');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/verify-forcefully/:id')
    async verifyEmailOrPhoneForcefully(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.verifyEmailOrPhoneForcefully(req.params.id, req.query.type as string);
            req.flash(result.type, result.message);
            req.query.path ? res.redirect(<string>req.query.path):res.redirect('/users/list');
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/view/:id')
    async userAccountView(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.userDetails(req.params.id);
            const user_primary_details = await this.userRepo.userPrimaryDetails(req.params.id);
       
            
            const data = result.data;
            if (data) {
                res.render('users/user-account.ejs', {
                    page_name: 'user-management',
                    page_title: 'Account Details for ' + data.fullName,
                    user: req.user,
                    response: data,
                    user_primary_details: user_primary_details[0],
                   
                });
            } else {
                req.flash(result.type, result.message);
                res.redirect('/users/list');
            }
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('users/update')
    @UseInterceptors(fileFieldsInterceptor)
    async userAccountUpdate(@UploadedFiles() files: Express.Multer.File[], @Body() dto: UserCreateFromAdminDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.userCreateFromAdmin(dto, files);
            req.flash(result.type, result.message);
            res.redirect('/users/view/' + dto.id);
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Get('users/reset-password/:id')
    async resetUserPassword(@Req() req: Request, @Res() res: Response) {
        try {
            const { data, type, message } = await this.userService.userDetails(req.params.id);
            if (type=='error') {
                req.flash(type, message);
            } else if (data.signupType!='Normal') {
                req.flash("error", "User has signed up using social accounts. Hence this account cannot be used for password authentication.");
            } else if (!data.email) {
                req.flash("error", "User hasn\'t provided any email address yet. Hence this account cannot be used for password authentication.");
            } else {
                const result = await this.userService.forgetPassword({ email: data.email }, 'frontend');
                req.flash(result.type, result.message);
            }
            res.redirect('/users/view/' + req.params.id);
        } catch (error) {
            console.error(error);
            res.redirect('/');
        }
    };


    @UseGuards(AuthGuard('jwt'))
    @UseFilters(AdminAuthFilter)
    @Post('users/change-password')
    async userChangePasswordSubmit(@Body() dto: ChangePwdDTO, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.userService.userChangePasswordSubmit(dto);

            req.flash(result.type, result.message);
            res.redirect('/users/view/' + dto.id);
        } catch (error) {
            console.error(error, 'error');
            res.redirect('/');
        }
    }
}
