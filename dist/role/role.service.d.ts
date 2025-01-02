import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
export declare class RoleService {
    private roleModel;
    constructor(roleModel: Model<RoleDocument>);
    getAllByField(params: any): Promise<Role[]>;
    getByField(params: any): Promise<Role>;
    getById(id: any): Promise<Role>;
}
