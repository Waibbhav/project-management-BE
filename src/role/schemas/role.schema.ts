import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
const roleGroup = ['backend', 'frontend'];

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: String, required: true })
  roleDisplayName: string;

  @Prop({ type: String, default: 'backend', enum: roleGroup })
  rolegroup: string;

  @Prop({ type: String, default: '' })
  desc: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
