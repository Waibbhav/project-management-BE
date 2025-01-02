import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/users.schema';
import { UserRepository } from '.';

@Global()
@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
              name: User.name,
              useFactory: () => {
                const schema = UserSchema;
                return schema;
              },
            },
        ])
    ],
    controllers: [],
    providers: [UserRepository],
    exports: [UserRepository]
})
export class UserRepositoryModule {}
