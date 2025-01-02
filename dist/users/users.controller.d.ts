/// <reference types="multer" />
import { Response, Request } from 'express';
import { AdminAccountDTO, AdminChangePasswordDTO, ChangePwdDTO, ForgetPwdDTO, SigninDTO, UserCreateFromAdminDTO } from './dto';
import { UserRepository } from './repositories';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    private userRepo;
    constructor(userService: UsersService, userRepo: UserRepository);
    loginScreen(req: Request, res: Response): Promise<void>;
    signin(dto: SigninDTO, req: Request, res: Response): Promise<void>;
    forgetPassword(dto: ForgetPwdDTO, req: Request, res: Response): Promise<void>;
    dashboard(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    account(req: Request, res: Response): Promise<void>;
    accountSubmit(files: Express.Multer.File[], dto: AdminAccountDTO, req: Request, res: Response): Promise<void>;
    settings(req: Request, res: Response): Promise<void>;
    adminChangePasswordSubmit(dto: AdminChangePasswordDTO, req: Request, res: Response): Promise<void>;
    userListView(req: Request, res: Response): Promise<void>;
    getAllUser(req: Request, res: Response): Promise<void>;
    userStore(files: Express.Multer.File[], dto: UserCreateFromAdminDTO, req: Request, res: Response): Promise<void>;
    statusChange(req: Request, res: Response): Promise<void>;
    deleteAccount(req: Request, res: Response): Promise<void>;
    verifyEmailOrPhoneForcefully(req: Request, res: Response): Promise<void>;
    userAccountView(req: Request, res: Response): Promise<void>;
    userAccountUpdate(files: Express.Multer.File[], dto: UserCreateFromAdminDTO, req: Request, res: Response): Promise<void>;
    resetUserPassword(req: Request, res: Response): Promise<void>;
    userChangePasswordSubmit(dto: ChangePwdDTO, req: Request, res: Response): Promise<void>;
}
