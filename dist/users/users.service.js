"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const role_schema_1 = require("../role/schemas/role.schema");
const repositories_1 = require("./repositories");
const jwt = require("jsonwebtoken");
const fs_1 = require("fs");
const mongoose = require('mongoose');
const OTP = require("otp-generator");
const helpers_1 = require("../helpers");
const moment = require("moment");
let UsersService = class UsersService {
    constructor(roleModel, userRepo, mailerService, utilsService) {
        this.roleModel = roleModel;
        this.userRepo = userRepo;
        this.mailerService = mailerService;
        this.utilsService = utilsService;
        this.generateHash = function (password) {
            console.log(password);
            return bcrypt.hashSync(password, bcrypt.genSaltSync(+process.env.SALT_ROUND));
        };
        this.validPassword = function (password, checkPassword) {
            return bcrypt.compareSync(password, checkPassword);
        };
    }
    async signin(body) {
        try {
            body.email = body.email.trim().toLowerCase();
            const roles = await this.roleModel.distinct("_id", {
                rolegroup: "frontend",
            });
            body["roles"] = roles;
            const userData = await this.userRepo.fineOneWithRole(body);
            if (userData.status == 500) {
                return { success: false, type: "error", message: userData.message };
            }
            const user = userData === null || userData === void 0 ? void 0 : userData.data;
            if (user) {
                const payload = {
                    id: user._id,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN.toString(),
                });
                return {
                    success: true,
                    type: "success",
                    data: { token, user },
                    message: "You have successfully logged in.",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Authentication failed. You are not a valid user.",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async forgetPassword(body, rolegroup) {
        try {
            body.email = body.email.trim().toLowerCase();
            const roles = await this.roleModel.distinct("_id", {
                rolegroup: rolegroup,
                isDeleted: false,
            });
            const userAvailable = await this.userRepo.getByField({
                email: body.email,
                role: { $in: roles },
                isDeleted: false,
            });
            if (!userAvailable) {
                return {
                    success: false,
                    type: "error",
                    message: "No account found with " + body.email,
                };
            }
            const pwd = OTP.generate(8, {
                digits: true,
                upperCaseAlphabets: true,
                lowerCaseAlphabets: true,
                specialChars: false,
            });
            body["password"] = this.generateHash(pwd);
            const sender = (process.env.PROJECT_NAME +
                " Admin<" +
                process.env.MAIL_USERNAME +
                ">");
            const locals = {
                name: userAvailable.fullName,
                password: pwd,
                project_name: process.env.PROJECT_NAME,
            };
            const mailTriggered = await this.mailerService.sendMail(sender, userAvailable.email, "Password Reset", "admin-forgot-password", locals);
            if (!mailTriggered) {
                return {
                    success: false,
                    type: "error",
                    message: "Failed to trigger email. Please use old password!",
                };
            }
            const updateUser = await this.userRepo.updateById(body, userAvailable._id);
            if (updateUser && updateUser._id) {
                return {
                    success: true,
                    type: "success",
                    message: "Mail sent to user's email address with new password!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong. Please use old password!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async accountSubmit(body, files, user) {
        try {
            body["fullName"] = body.first_name.trim() + " " + body.last_name;
            body.email = body.email.trim().toLowerCase();
            body.id = mongoose.Types.ObjectId(body.id);
            const userAvailable = await this.userRepo.getByField({
                email: body.email,
                _id: { $ne: body.id },
                isDeleted: false,
            });
            if (!userAvailable) {
                if (files && files.profile_image && files.profile_image.length) {
                    body["profile_image"] = files.profile_image[0].filename;
                    user.profile_image &&
                        (0, fs_1.existsSync)("./public/uploads/user/" + user.profile_image) &&
                        (0, fs_1.unlinkSync)("./public/uploads/user/" + user.profile_image);
                }
                const updateUser = await this.userRepo.updateById(body, body.id);
                if (updateUser && updateUser._id) {
                    return {
                        success: true,
                        type: "success",
                        message: "Account updated successfully!",
                    };
                }
                else {
                    return {
                        success: false,
                        type: "error",
                        message: "Something went wrong!",
                    };
                }
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Email already exists for another account!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async adminChangePasswordSubmit(body, user) {
        try {
            body.id = mongoose.Types.ObjectId(body.id);
            const oldPasswordMatch = this.validPassword(body.old_password, user.password);
            if (!oldPasswordMatch) {
                return {
                    success: false,
                    type: "error",
                    message: "Old credential mis-matched!",
                };
            }
            const newPassVsOldPass = this.validPassword(body.password, user.password);
            if (newPassVsOldPass) {
                return {
                    success: false,
                    type: "error",
                    message: "New password cannot be same as your old password!",
                };
            }
            const pwd = body.password;
            body.password = this.generateHash(pwd);
            const userUpdate = await this.userRepo.updateById(body, body.id);
            if (userUpdate && userUpdate._id) {
                const sender = (process.env.PROJECT_NAME +
                    " Admin<" +
                    process.env.MAIL_USERNAME +
                    ">");
                const locals = {
                    name: user.fullName,
                    password: pwd,
                    project_name: process.env.PROJECT_NAME,
                };
                this.mailerService.sendMail(sender, user.email, "Password Changed Successfully", "admin-user-change-password", locals);
                return {
                    success: true,
                    type: "success",
                    message: "Password changed successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async userChangePasswordSubmit(body) {
        try {
            body.id = mongoose.Types.ObjectId(body.id);
            const pwd = body.new_password;
            body["password"] = this.generateHash(pwd);
            const userUpdate = await this.userRepo.updateById(body, body.id);
            if (userUpdate && userUpdate._id) {
                const sender = (process.env.PROJECT_NAME +
                    " Admin<" +
                    process.env.MAIL_USERNAME +
                    ">");
                const locals = {
                    name: userUpdate.fullName,
                    password: pwd,
                    project_name: process.env.PROJECT_NAME,
                };
                this.mailerService.sendMail(sender, userUpdate.email, "Password Changed Successfully", "admin-user-change-password", locals);
                return {
                    success: true,
                    type: "success",
                    message: "Password changed successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong!",
                };
            }
        }
        catch (error) {
            console.error(error, "err");
            return { success: false, type: "error", message: error.message };
        }
    }
    async getAllUser(req) {
        try {
            const start = +req.body.start;
            const length = +req.body.length;
            let currentPage = 1;
            if (start > 0) {
                currentPage = Math.round((start + length) / length);
            }
            req.body.page = currentPage;
            req.body.role = "buyer";
            let user = await this.userRepo.getAllUsers(req);
            let data = {
                recordsTotal: user.totalDocs,
                recordsFiltered: user.totalDocs,
                data: user.docs,
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`,
            };
        }
        catch (error) {
            console.error(error);
            return {
                status: 500,
                data: {
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                },
                message: error.message,
            };
        }
    }
    async userListPageStats() {
        try {
            const userRole = await this.roleModel.findOne({
                isDeleted: false,
                role: "buyer",
            });
            const totalUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                isDeleted: false,
            });
            const recentUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                createdAt: { $gte: new Date(moment().subtract(24, "hours").format()) },
                isDeleted: false,
            });
            const activeUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                status: "Active",
                isDeleted: false,
            });
            const bannedUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                status: "Banned",
                isDeleted: false,
            });
            return {
                totalUserCount,
                recentUserCount,
                activeUserCount,
                bannedUserCount,
            };
        }
        catch (error) {
            console.error(error);
            return {
                totalUserCount: 0,
                recentUserCount: 0,
                activeUserCount: 0,
                bannedUserCount: 0,
            };
        }
    }
    async dashboardPageStats() {
        try {
            const userRole = await this.roleModel.findOne({
                isDeleted: false,
                role: "buyer",
            });
            const supplierRole = await this.roleModel.findOne({
                isDeleted: false,
                role: "supplier",
            });
            const totalUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                isDeleted: false,
            });
            const recentUserCount = await this.userRepo.getCountByParam({
                role: userRole._id,
                createdAt: { $gte: new Date(moment().subtract(24, "hours").format()) },
                isDeleted: false,
            });
            const totalSupplierCount = await this.userRepo.getCountByParam({
                role: supplierRole._id,
                isDeleted: false,
            });
            const recentSupplierCount = await this.userRepo.getCountByParam({
                role: supplierRole._id,
                createdAt: { $gte: new Date(moment().subtract(24, "hours").format()) },
                isDeleted: false,
            });
            return {
                totalUserCount,
                recentUserCount,
                totalSupplierCount,
                recentSupplierCount,
            };
        }
        catch (error) {
            console.error(error);
            return {
                totalUserCount: 0,
                recentUserCount: 0,
                totalSupplierCount: 0,
                recentSupplierCount: 0,
            };
        }
    }
    async userCreateFromAdmin(body, files) {
        try {
            body = this.utilsService.getNamesFromBody(body);
            body.email = body.email.toLowerCase().trim();
            const userRole = await this.roleModel.findOne({
                role: "buyer",
                isDeleted: false,
            });
            body["role"] = userRole._id;
            const userAvailableWithEmail = await this.userRepo.getByField({
                email: body.email,
                signupCompleted: true,
                isDeleted: false,
            });
            if (body.phone) {
                const userAvailableWithPhone = await this.userRepo.getByField({
                    phone: body.phone,
                    countryCode: body.countryCode,
                    signupCompleted: true,
                    isDeleted: false,
                });
                if (!userAvailableWithPhone) {
                    await this.userRepo.bulkDelete({
                        phone: body.phone,
                        countryCode: body.countryCode,
                        signupCompleted: false,
                        isDeleted: false,
                    });
                }
                else if (userAvailableWithPhone.status == "Banned") {
                    return {
                        success: false,
                        type: "error",
                        message: "Account already marked as Banned against this phone number.",
                    };
                }
                else {
                    return {
                        success: false,
                        type: "error",
                        message: "Account already exists with this phone number.",
                    };
                }
            }
            if (!userAvailableWithEmail) {
                await this.userRepo.bulkDelete({
                    email: body.email,
                    signupCompleted: false,
                    isDeleted: false,
                });
            }
            else if (userAvailableWithEmail.status == "Banned") {
                return {
                    success: false,
                    type: "error",
                    message: "Account already marked as Banned against this email address.",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Account already exists with this email address.",
                };
            }
            if (files && files.profile_image && files.profile_image.length) {
                body["profile_image"] = files.profile_image[0].filename;
            }
            const pwd = OTP.generate(8, {
                digits: true,
                upperCaseAlphabets: true,
                lowerCaseAlphabets: true,
                specialChars: false,
            });
            body["password"] = this.generateHash(pwd);
            body["signupType"] = "Normal";
            body["signupCompleted"] = true;
            body["isEmailVerified"] = true;
            body["status"] = "Active";
            const saveUser = await this.userRepo.save(body);
            if (saveUser && saveUser._id) {
                const sender = (process.env.PROJECT_NAME +
                    " Admin<" +
                    process.env.MAIL_USERNAME +
                    ">");
                const locals = {
                    name: saveUser.fullName,
                    email: saveUser.email,
                    password: pwd,
                    project_name: process.env.PROJECT_NAME,
                };
                this.mailerService.sendMail(sender, saveUser.email, "Account Created", "admin-user-registration", locals);
                return {
                    success: true,
                    type: "success",
                    data: saveUser,
                    message: "User account created successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async userSignup(body, files) {
        try {
            body = this.utilsService.getNamesFromBody(body);
            body.email = body.email.toLowerCase().trim();
            const userRole = await this.roleModel.findOne({
                role: "user"
            });
            body["role"] = userRole._id;
            const userAvailableWithEmail = await this.userRepo.getByField({
                email: body.email,
                signupCompleted: true,
                isDeleted: false,
            });
            if (!userAvailableWithEmail) {
                await this.userRepo.bulkDelete({
                    email: body.email,
                    signupCompleted: false,
                    isDeleted: false,
                });
            }
            else if (userAvailableWithEmail.status == "Banned") {
                return {
                    success: false,
                    type: "error",
                    message: "Account already marked as Banned against this email address.",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Account already exists with this email address.",
                };
            }
            if (files && files.profile_image && files.profile_image.length) {
                body["profile_image"] = files.profile_image[0].filename;
            }
            body["password"] = this.generateHash(body["password"]);
            body["signupType"] = "Normal";
            body["signupCompleted"] = true;
            body["isEmailVerified"] = true;
            body["status"] = "Active";
            const saveUser = await this.userRepo.save(body);
            if (saveUser && saveUser._id) {
                return {
                    success: true,
                    type: "success",
                    data: saveUser,
                    message: "User account created successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async statusChange(id, status) {
        try {
            id = mongoose.Types.ObjectId(id);
            const userDetails = await this.userRepo.getById(id);
            if (!userDetails) {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong.. No User Found!",
                };
            }
            if (!userDetails.signupCompleted) {
                return {
                    success: false,
                    type: "error",
                    message: "Signup needs to be completed first!",
                };
            }
            let updateUser = await this.userRepo.updateById({
                status: status,
            }, id);
            if (updateUser && updateUser._id) {
                return {
                    success: true,
                    type: "success",
                    message: "User status updated!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async deleteAccount(id) {
        try {
            id = mongoose.Types.ObjectId(id);
            const userDetails = await this.userRepo.getById(id);
            if (!userDetails) {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong.. No User Found!",
                };
            }
            let updateUser = await this.userRepo.updateById({
                isDeleted: true,
            }, id);
            if (updateUser && updateUser._id) {
                return {
                    success: true,
                    type: "success",
                    message: "Account deleted successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async verifyEmailOrPhoneForcefully(id, type) {
        try {
            id = mongoose.Types.ObjectId(id);
            const userDetails = await this.userRepo.getById(id);
            if (!userDetails) {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong.. No User Found!",
                };
            }
            let verificationObj = {
                signupCompleted: true,
            };
            if (!userDetails.signupCompleted && userDetails.status == "Inactive") {
                verificationObj["status"] = "Active";
            }
            if (type == "Phone") {
                if (userDetails.otp && userDetails.otpType == "Phone Verification") {
                    verificationObj["otp"] = "";
                    verificationObj["otpType"] = "None";
                    verificationObj["isPhoneVerified"] = true;
                }
            }
            else {
                if (userDetails.otp && userDetails.otpType == "Email Verification") {
                    verificationObj["otp"] = "";
                    verificationObj["otpType"] = "None";
                    verificationObj["isEmailVerified"] = true;
                }
            }
            let updateUser = await this.userRepo.updateById(verificationObj, id);
            if (updateUser && updateUser._id) {
                return {
                    success: true,
                    type: "success",
                    message: type + " verified successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something Went Wrong!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
    async userDetails(id) {
        try {
            id = mongoose.Types.ObjectId(id);
            let userDetails = await this.userRepo.getUserDetails({
                _id: id,
                isDeleted: false,
            });
            if (userDetails && userDetails.length) {
                return {
                    success: true,
                    type: "success",
                    data: userDetails[0],
                    message: "User details fetched successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    data: null,
                    message: "Something Went Wrong.. No User Found!",
                };
            }
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
                type: "error",
                data: null,
                message: error.message,
            };
        }
    }
    async userUpdateFromAdmin(body, files) {
        try {
            const id = mongoose.Types.ObjectId(body.id);
            const userDetails = await this.userRepo.getById(id);
            if (!userDetails) {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong.. No user found!",
                };
            }
            body = this.utilsService.getNamesFromBody(body);
            body.email = body.email.toLowerCase().trim();
            const userAvailableWithEmail = await this.userRepo.getByField({
                email: body.email,
                _id: { $ne: id },
                signupCompleted: true,
                isDeleted: false,
            });
            if (body.phone) {
                const userAvailableWithPhone = await this.userRepo.getByField({
                    phone: body.phone,
                    countryCode: body.countryCode,
                    signupCompleted: true,
                    _id: { $ne: id },
                    isDeleted: false,
                });
                if (!userAvailableWithPhone) {
                    await this.userRepo.bulkDelete({
                        phone: body.phone,
                        countryCode: body.countryCode,
                        _id: { $ne: id },
                        signupCompleted: false,
                        isDeleted: false,
                    });
                }
                else if (userAvailableWithPhone.status == "Banned") {
                    return {
                        success: false,
                        type: "error",
                        message: "Account already marked as Banned against this phone number.",
                    };
                }
                else {
                    return {
                        success: false,
                        type: "error",
                        message: "Account already exists with this phone number.",
                    };
                }
            }
            if (!userAvailableWithEmail) {
                await this.userRepo.bulkDelete({
                    email: body.email,
                    signupCompleted: false,
                    _id: { $ne: id },
                    isDeleted: false,
                });
            }
            else if (userAvailableWithEmail.status == "Banned") {
                return {
                    success: false,
                    type: "error",
                    message: "Account already marked as Banned against this email address.",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Account already exists with this email address.",
                };
            }
            if (files && files.profile_image && files.profile_image.length) {
                body["profile_image"] = files.profile_image[0].filename;
                userDetails.profile_image &&
                    (0, fs_1.existsSync)("./public/uploads/user/" + userDetails.profile_image) &&
                    (0, fs_1.unlinkSync)("./public/uploads/user/" + userDetails.profile_image);
            }
            const updateUser = await this.userRepo.updateById(body, id);
            if (updateUser && updateUser._id) {
                return {
                    success: true,
                    type: "success",
                    data: updateUser,
                    message: "User account updated successfully!",
                };
            }
            else {
                return {
                    success: false,
                    type: "error",
                    message: "Something went wrong",
                };
            }
        }
        catch (error) {
            console.error(error);
            return { success: false, type: "error", message: error.message };
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        repositories_1.UserRepository,
        helpers_1.MailerService,
        helpers_1.UtilsService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map