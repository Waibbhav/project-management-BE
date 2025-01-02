import { Response, Request } from "express";
import { SigninDTO, SignupDTO } from "./dto";
import { UserRepository } from "./repositories";
import { UsersService } from "./users.service";
export declare class UserApiController {
    private userService;
    private userRepo;
    constructor(userService: UsersService, userRepo: UserRepository);
    signin(dto: SigninDTO, req: Request, res: Response): Promise<void>;
    SignupDTO(dto: SignupDTO, req: Request, res: Response): Promise<void>;
}
