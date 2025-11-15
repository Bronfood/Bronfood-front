import { createContext, FC, PropsWithChildren, useState } from 'react';
import { authService, CaptchaResponse, LoginData, RegisterPayload, RegisterPromise, RestorePasswordPayload, UpdateUserPayload, User } from '../utils/api/authService';
import { useMutation, UseMutationResult, useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';

type CurrentUserContext = {
    currentUser: User | null;
    isLogin: boolean;
    signIn: UseMutationResult<void, Error, LoginData, unknown> | Record<string, never>;
    signUp: UseMutationResult<{ data: RegisterPromise }, Error, RegisterPayload, unknown> | Record<string, never>;
    logout: UseMutationResult<void, Error, void, unknown> | Record<string, never>;
    updateUser: UseMutationResult<void, Error, UpdateUserPayload, unknown> | Record<string, never>;
    confirmSignUp: UseMutationResult<void, Error, { confirmation_code: string }, unknown> | Record<string, never>;
    confirmUpdateUser: UseMutationResult<void, Error, { confirmation_code: string }, unknown> | Record<string, never>;
    profile: UseQueryResult<{ data: User }, Error> | Record<string, never>;
    restorePassword: UseMutationResult<void, Error, RestorePasswordPayload, unknown> | Record<string, never>;
    confirmRestorePassword: UseMutationResult<void, Error, { newPassword: string; reNewPassword: string; code: string }, unknown> | Record<string, never>;
    getCaptcha: UseQueryResult<CaptchaResponse, Error> | Record<string, never>;
};

export const CurrentUserContext = createContext<CurrentUserContext>({
    currentUser: null,
    isLogin: false,
    signIn: {},
    signUp: {},
    logout: {},
    updateUser: {},
    confirmSignUp: {},
    confirmUpdateUser: {},
    profile: {},
    restorePassword: {},
    confirmRestorePassword: {},
    getCaptcha: {},
});

export const CurrentUserProvider: FC<PropsWithChildren> = ({ children }) => {
    const token = localStorage.getItem('token');
    const [phone, setPhone] = useState<string>('');
    const client = useQueryClient();

    useQuery({
        queryKey: ['refresh token'],
        queryFn: () => authService.refreshToken(),
        refetchInterval: 4.9 * 60 * 1000,
        refetchIntervalInBackground: true,
        retry: false,
    });

    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: () => authService.getProfile(),
        retry: false,
        enabled: !!token,
    });

    const captcha = useQuery({
        queryKey: ['captcha'],
        queryFn: () => authService.getCaptcha(),
        retry: false,
    });

    const isLogin = !!profile.data;

    const signIn = useMutation({
        mutationFn: (variables: LoginData) => authService.login(variables),
        onSuccess: () => profile.refetch(),
    });
    const signUp = useMutation({
        mutationFn: (variables: RegisterPayload) => authService.register(variables),
        onSuccess: (res) => setPhone(res.data.phone),
    });
    const confirmSignUp = useMutation({
        mutationFn: (variables: { confirmation_code: string }) => authService.confirmRegister({ phone, code: variables.confirmation_code }),
        onSuccess: () => profile.refetch(),
    });
    const updateUser = useMutation({
        mutationFn: (variables: UpdateUserPayload) => authService.updateUser(variables),
        onSuccess: () => profile.refetch(),
    });
    const confirmUpdateUser = useMutation({
        mutationFn: (variables: { confirmation_code: string }) => authService.confirmUpdateUser({ code: variables.confirmation_code }),
        onSuccess: () => profile.refetch(),
    });
    const logout = useMutation({
        mutationFn: () => authService.logOut(),
        onSuccess: () => {
            client.removeQueries({ queryKey: ['profile'] });
            profile.refetch();
        },
    });
    const restorePassword = useMutation({
        mutationFn: (variables: RestorePasswordPayload) => authService.restorePassword(variables),
        onSuccess: (_res, variables: RestorePasswordPayload) => setPhone(variables.phone),
    });
    const confirmRestorePassword = useMutation({
        mutationFn: (variables: { newPassword: string; reNewPassword: string; code: string }) => authService.confirmRestorePassword({ phone, newPassword: variables.newPassword, reNewPassword: variables.reNewPassword, code: variables.code }),
        onSuccess: () => profile.refetch(),
    });

    return (
        <CurrentUserContext.Provider
            value={{
                currentUser: profile.data?.data || null,
                isLogin,
                signIn,
                signUp,
                logout,
                updateUser,
                confirmSignUp,
                confirmUpdateUser,
                profile,
                restorePassword,
                confirmRestorePassword,
                getCaptcha: captcha,
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    );
};
