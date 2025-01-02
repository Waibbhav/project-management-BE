export declare class SigninDTO {
    email: string;
    password: string;
}
export declare class SignupDTO {
    first_name: string;
    last_name: string;
    companyName: string;
    email: string;
    password: string;
    profile_image: any;
}
export declare class ForgetPwdDTO {
    email: string;
}
export declare class ChangePwdDTO {
    new_password: string;
    confirm_password: string;
    id: string;
}
export declare class AdminAccountDTO {
    email: string;
    first_name: string;
    last_name: string;
    id: string;
}
export declare class AdminChangePasswordDTO {
    old_password: string;
    password: string;
    "confirm-new-password": string;
    id: string;
}
export declare class UserCreateFromAdminDTO {
    email: string;
    fullName: string;
    phone: string;
    countryCode: string;
    business_type: string;
    id: string;
}
