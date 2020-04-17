const express = require('express')
const { uuid } = require('uuidv4');
const queryString = require('query-string');
const axios = require('axios').default;

/**
 * Express
 */
const app = express()
const port = process.env.PORT || 3000;

/**
 * GH Env Vars
 */
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPE_STR = process.env.SCOPE_STR;
const CALLBACK_URL_BASE = process.env.CALLBACK_URL_BASE;

app.get('', (req, res) => {
    res.send("In order to use this server, you must first run a query to '/authorize'");
})

app.get('/authorize', (req, res) => {
    const state = uuid();

    console.log("I AM RUNNING");

    const queryParams =
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${CALLBACK_URL_BASE}/callback&` +
        `scope=${SCOPE_STR}&` +
		`state=${state}`

    const URI = `https://github.com/login/oauth/authorize?${queryParams}`;

    console.log("URI", URI);

    res.redirect(URI);
})

app.get('/callback', (req, res) => {
    console.log("I AM CALLING BACK", req.query);

    const code = req.query.code;
    const state = req.query.state;

    const queryParams = queryString.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        state
    });

    /**
     * @example {"access_token":"e72e16c7e42f292c6912e7710c838347ae178b4a", "scope":"repo,gist", "token_type":"bearer"}
     */
    axios.post(`https://github.com/login/oauth/access_token?${queryParams}`, {}, {
        headers: {
            Accept: "application/json"
        }
    })
        .then(({data}) => {

            const redirectParams = queryString.stringify(data);
            res.redirect(`${CALLBACK_URL_BASE}/success${redirectParams}`)
        });

});

app.get('/success', (req, res) => {
    res.send(`It worked! Recieved req.query of:`, JSON.stringify(req.query));
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
