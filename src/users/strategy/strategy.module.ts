import { Module, Global } from '@nestjs/common';
import { JwtStrategy } from '.';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [JwtStrategy],
})
export class StrategyModule { }
