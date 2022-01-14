import { VercelRequest, VercelResponse } from '@vercel/node';
import queryString from "query-string";
import axios from "axios";

const removeFinalSlash = (str: string) => {
    if (str.endsWith('/')) {
        return str.substring(0, str.length - 1)
    }
    return str;
}

/**
 * GH Env Vars
 */
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const FINAL_CALLBACK_URL_BASE = removeFinalSlash(process.env.FINAL_CALLBACK_URL_BASE as string);

export default async (_req: VercelRequest, res: VercelResponse) => {
    const code = _req.query.code;
    const state = _req.query.state;

    const queryParams = queryString.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        state,
    });

    /**
     * @example {"access_token":"e72e16c7e42f292c6912e7710c838347ae178b4a", "scope":"repo,gist", "token_type":"bearer"}
     */
    const {data} = await axios.post(`https://github.com/login/oauth/access_token?${queryParams}`, {}, {
        headers: {
            Accept: 'application/json',
        },
    });

    const redirectParams = queryString.stringify(data);
    res.redirect(`${FINAL_CALLBACK_URL_BASE}/success?${redirectParams}`);
};
