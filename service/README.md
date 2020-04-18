# Systemd Setup

1.  Create a user with no login (optional)

	This helps with setting restrictive permissions on the `.env` file and gives the service default permissions on the rest of your server unlike using root and your current user.

	```bash
	useradd -d /var/www/example.com/auth github-oauth-proxy
	passwd -l github-oauth-proxy
	```

2. Edit the service file

	The user can be any user on your server, and it should match the one created in step one if created.

	The file paths should match where the service is located. You may choose a directory related to your web server, but not one that it is serving as you could leak your `.env` file.

	[`github-oauth-proxy.service`](./github-oauth-proxy.service)

	```text
	User=github-oauth-proxy
	EnvironmentFile=/var/www/auth.example.com/.env
	ExecStart=/usr/bin/node /var/www/auth.example.com/app.js
	```

3. Enable and start the service

	The service will automatically restart on error and start on boot.

	```bash
	mv github-oauth-proxy.service /lib/systemd/system/
	systemctl start github-oauth-proxy
	systemctl enable github-oauth-proxy
	```

4. The service should be live! Proceed to setting up a reverse proxy, SSL, etc.
