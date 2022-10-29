export const DOMAIN =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "";

export const VERSION = "v1";
export const BASE_URL = `${DOMAIN}/api/${VERSION}`;

export const BASE_AUTH_URL = `${BASE_URL}/auth`;
export const REGISTER_URL = `${BASE_AUTH_URL}/register`;
export const LOGIN_URL = `${BASE_AUTH_URL}/login`;

export const BASE_NOTE_URL = `${BASE_URL}/note`;
export const CREATE_NOTE_URL = `${BASE_NOTE_URL}/`;
export const GET_NOTE_URL = `${BASE_NOTE_URL}/`;
export const GET_NOTES_URL = `${BASE_NOTE_URL}/`;
export const GET_ALL_NOTES_URL = `${BASE_NOTE_URL}/all`;
export const EDIT_NOTE_URL = `${BASE_NOTE_URL}/`;
export const DELETE_NOTE_URL = `${BASE_NOTE_URL}/`;
