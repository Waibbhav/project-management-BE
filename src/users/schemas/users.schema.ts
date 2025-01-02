import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String, default: "", index: true })
  first_name: string;

  @Prop({ type: String, default: "", index: true })
  last_name: string;

  @Prop({ type: String, default: "", index: true })
  fullName: string;

  @Prop({ type: String, default: "", index: true })
  countryCode: string;

  @Prop({ type: String, default: "", index: true })
  phone: string;

  @Prop({ type: String, default: "", index: true })
  email: string;

  @Prop({ type: mongoose.Types.ObjectId, default: "", index: true })
  role: mongoose.Types.ObjectId;

  @Prop({ type: String, default: "" })
  password: string;

  @Prop({ type: String, default: "" })
  companyName: string;

  @Prop({ type: String, default: "" })
  profile_image: string;

  @Prop({ type: String, default: "" })
  stripeCustomerId: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop([])
  verificationDocs: [];

  @Prop({ type: Boolean, default: false })
  accountVerified: boolean;

  @Prop({ type: Boolean, default: false })
  accountVerificationRequested: boolean;

  @Prop({ type: String, default: "" })
  otp: string;

  @Prop({
    type: String,
    default: "None",
    enum: [
      "None",
      "Reset Password",
      "Change Password",
      "Email Verification",
      "Phone Verification",
    ],
  })
  otpType: string;

  @Prop({
    type: String,
    default: "Normal",
    enum: ["Normal", "Apple", "Google"],
  })
  signupType: string;

  @Prop({ type: String, default: "" })
  appleId: string;

  @Prop({ type: String, default: "" })
  googleId: string;

  @Prop({ type: Boolean, default: false })
  signupCompleted: boolean;

  @Prop({
    type: String,
    default: "Inactive",
    enum: ["Active", "Inactive", "Banned"],
    index: true,
  })
  status: string;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongooseAggregatePaginate);
