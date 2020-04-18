const express = require('express')
const { uuid } = require('uuidv4');
const queryString = require('query-string');
const axios = require('axios').default;

/**
 * Express
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * GH Env Vars
 */
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPE_STR = process.env.SCOPE_STR;
const SERVER_CALLBACK_URL_BASE = process.env.SERVER_CALLBACK_URL_BASE;
const FINAL_CALLBACK_URL_BASE = process.env.FINAL_CALLBACK_URL_BASE;

app.get('/authorize', (req, res) => {
	const state = uuid();

	const queryParams = queryString.stringify({
		client_id: CLIENT_ID,
		redirect_uri: `${SERVER_CALLBACK_URL_BASE}/callback`,
		scope: SCOPE_STR,
		state,
	});

	res.redirect(`https://github.com/login/oauth/authorize?${queryParams}`);
});

app.get('/callback', async (req, res) => {
	const code = req.query.code;
	const state = req.query.state;

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
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
