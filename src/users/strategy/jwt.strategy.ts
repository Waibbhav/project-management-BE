import { Injectable, Redirect } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../repositories";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor(private userRepo: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token'),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.userRepo.authentication(payload.id);
        return user||null;
    }
}