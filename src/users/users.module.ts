import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/role/schemas/role.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserApiController } from './users.api.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          const schema = RoleSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController, UserApiController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
