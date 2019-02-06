export const ROOT_URL = "/";
export const LOGIN_URL = "/login";
export const SIGN_UP_URL = "/sign-up";
export const RESUME_PATH = "/resume/:title";
export const RESET_PATH = "/reset/:token";
export const ZURUCK_SETZEN_PFAD_ANFORDERN = "anfordern";

export enum ResumePathHash {
  edit = "#edit",
  preview = "#preview"
}

export function makeResumeRoute(
  title: string,
  hash: ResumePathHash | "" = ResumePathHash.edit
) {
  return RESUME_PATH.replace(":title", encodeURIComponent(title)) + hash;
}

export function makeResetRoute(token: string) {
  return RESET_PATH.replace(":token", encodeURIComponent(token));
}

export function createResetRoute() {
  return RESET_PATH.replace(":token", ZURUCK_SETZEN_PFAD_ANFORDERN);
}
