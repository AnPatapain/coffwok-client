const isProd = true

export const ACCESS_TOKEN = 'accessToken'
export const PROFILE_IMG = 'profileImg'
export const USER_ID = 'userId'
export const PROFILE_ID = 'profileId'

let API_BASE_URL, OAUTH2_REDIRECT_URI
if(!isProd) {
    API_BASE_URL = 'http://localhost:8080';
    OAUTH2_REDIRECT_URI = 'http://localhost:5173/oauth2/redirect'
}else {
    API_BASE_URL = 'https://coffwok-backend.herokuapp.com'
    OAUTH2_REDIRECT_URI = 'https://www.coffwok.com/oauth2/redirect'
}

export { API_BASE_URL, OAUTH2_REDIRECT_URI }

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;

export const SHOW_NOTIFICATION = "showNotification"