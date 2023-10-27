import { signUpRoute } from './signUpRout.js';
import { LogInRoute } from './loginRout.js';
import { updateUserInfoRoute } from './updateRoute.js';
import { verifyEmailRoute } from './verifyEmailRoute.js';
import { forgotPaswordRoute } from './forgotPasswordRoute.js';
import { resetPasswordRoute } from './resetPasswordRoute.js';
import { getGoogleOauthUrlRoute } from './getGoogleOauthUrlRoute.js';
import { googleOauthCallbackRoute } from './googleOauthCallbackRoute.js';

export const routes = [
    LogInRoute,
    signUpRoute,
    updateUserInfoRoute,
    verifyEmailRoute,
    forgotPaswordRoute,
    resetPasswordRoute,
    getGoogleOauthUrlRoute,
    googleOauthCallbackRoute
];
