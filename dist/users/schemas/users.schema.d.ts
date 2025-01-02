import * as mongoose from 'mongoose';
export type UserDocument = mongoose.HydratedDocument<User>;
export declare class User {
    first_name: string;
    last_name: string;
    fullName: string;
    countryCode: string;
    phone: string;
    email: string;
    role: mongoose.Types.ObjectId;
    password: string;
    companyName: string;
    profile_image: string;
    stripeCustomerId: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    verificationDocs: [];
    accountVerified: boolean;
    accountVerificationRequested: boolean;
    otp: string;
    otpType: string;
    signupType: string;
    appleId: string;
    googleId: string;
    signupCompleted: boolean;
    status: string;
    isDeleted: boolean;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User>;
