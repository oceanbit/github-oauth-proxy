import { VercelRequest, VercelResponse } from '@vercel/node';
import queryString from "query-string";
import axios from "axios";

/**
 * GH Env Vars
 */
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPE_STR = process.env.SCOPE_STR;
const SERVER_CALLBACK_URL_BASE = process.env.SERVER_CALLBACK_URL_BASE;
const FINAL_CALLBACK_URL_BASE = process.env.FINAL_CALLBACK_URL_BASE;

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
