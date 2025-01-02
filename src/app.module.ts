import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Cms_repositoryModule } from './cms/repositories/cms_repository.module';
import { StrategyModule } from './users/strategy/strategy.module';
import { HelperModule } from './helpers/helper.module';
import { UserRepositoryModule } from './users/repositories/userrepository.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { CmsModule } from './cms/cms.module';

const EventEmitterOptions = {
  // set this to `true` to use wildcards
  wildcard: false,
  // the delimiter used to segment namespaces
  delimiter: '.',
  // set this to `true` if you want to emit the newListener event
  newListener: false,
  // set this to `true` if you want to emit the removeListener event
  removeListener: false,
  // the maximum amount of listeners that can be assigned to an event
  maxListeners: 10,
  // show event name in memory leak message when more than maximum amount of listeners is assigned
  verboseMemoryLeak: false,
  // disable throwing uncaughtException if an error event is emitted and it has no listeners
  ignoreErrors: false,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      "mongodb+srv://developer123:Developer%40123@cluster0.kcjuv.mongodb.net/servicemanagemantDB"
    ),
    EventEmitterModule.forRoot(EventEmitterOptions),
    UsersModule,
    RoleModule,
    UserRepositoryModule,
    HelperModule,
    StrategyModule,
    CmsModule,
    Cms_repositoryModule,
  ],
})
export class AppModule {}
