import { Strategy } from "passport-jwt";
import { UserRepository } from "../repositories";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepo;
    constructor(userRepo: UserRepository);
    validate(payload: any): Promise<any>;
}
export {};
