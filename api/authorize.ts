import { VercelRequest, VercelResponse } from '@vercel/node';
import {uuid} from "uuidv4";
import * as queryString from "query-string";

const removeFinalSlash = (str: string) => {
    if (str.endsWith('/')) {
        return str.substring(0, str.length - 1)
    }
    return str;
}

/**
 * GH Env Vars
 */
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPE_STR = process.env.SCOPE_STR;
const SERVER_CALLBACK_URL_BASE = removeFinalSlash(process.env.SERVER_CALLBACK_URL_BASE as string);

export default (_req: VercelRequest, res: VercelResponse) => {
    const state = uuid();

    const queryParams = queryString.stringify({
        client_id: CLIENT_ID,
        redirect_uri: `${SERVER_CALLBACK_URL_BASE}/callback`,
        scope: SCOPE_STR,
        state,
    });

    res.redirect(`https://github.com/login/oauth/authorize?${queryParams}`);
};
