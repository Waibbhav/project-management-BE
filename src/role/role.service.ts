import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getAllByField(params: any): Promise<Role[]> {
    try {
      return await this.roleModel.find(params).exec();
    } catch (error) {
      return error;
    }
  }

  async getByField(params: any): Promise<Role> {
    try {
      return await this.roleModel.findOne(params).exec();
    } catch (error) {
      return error;
    }
  }

  async getById(id: any): Promise<Role> {
    try {
      return await this.roleModel.findById(id).exec();
    } catch (error) {
      return error;
    }
  }
}
