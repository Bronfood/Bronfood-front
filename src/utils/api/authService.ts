import { AuthServiceReal } from './authServiceReal';

export interface LoginData {
    phone: string;
    password: string;
}
export interface RegisterPayload {
    phone: string;
    password: string;
    name: string;
    captcha: string;
}
export interface RegisterPromise {
    id: number;
    name: string;
    phone: string;
}
export interface ConfirmRegisterPayload {
    phone: string;
    code: string;
}
export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}
export interface ConfirmUpdateUser {
    code: string;
}
export interface User {
    id: number;
    is_banned: boolean;
    is_staff: boolean;
    is_verified: boolean;
    name: string;
    phone: string;
    role: string;
    username: string;
}
export interface SuccessProfileResponse {
    status: 'success';
    data: User;
}
export interface ErrorProfileResponse {
    status: 'error';
    error_message: string;
}
export interface RestorePasswordPayload {
    phone: string;
}
export interface confirmRestorePasswordPayload {
    phone: string;
    newPassword: string;
    reNewPassword: string;
    code: string;
}

export interface CaptchaResponse {
    image: string;
    ttl: number;
}

export interface AuthService {
    login: ({ phone, password }: LoginData) => Promise<void>;

    register: ({ name, phone, password }: RegisterPayload) => Promise<{ data: RegisterPromise }>;

    confirmRegister: ({ phone, code }: ConfirmRegisterPayload) => Promise<void>;

    updateUser: ({ name, phone, currentPassword, newPassword, newPasswordConfirm }: UpdateUserPayload) => Promise<void>;

    confirmUpdateUser: ({ code }: ConfirmUpdateUser) => Promise<void>;

    logOut: () => Promise<void>;

    getProfile: () => Promise<{ data: User }>;

    refreshToken: () => Promise<void>;

    restorePassword: ({ phone }: RestorePasswordPayload) => Promise<void>;

    confirmRestorePassword: ({ phone, newPassword, reNewPassword, code }: confirmRestorePasswordPayload) => Promise<void>;

    getCaptcha(): Promise<CaptchaResponse>;
}

export const authService = new AuthServiceReal();
