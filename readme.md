<h1 align="center">Send Mail<br />
<div align="center">
  
  [![Build](https://github.com/action-pack/send-mail/actions/workflows/build.yml/badge.svg)](https://github.com/action-pack/send-mail/)
  [![Version](https://img.shields.io/github/v/tag/action-pack/send-mail?label=version&sort=semver&color=066da5)](https://github.com/marketplace/actions/send-mail)
  [![Size](https://img.shields.io/github/size/action-pack/send-mail/dist/index.js?branch=release/v1.00&label=size&color=066da5)](https://github.com/action-pack/send-mail/)
  
</div></h1>

Action to send an email.

## Usage

```yaml
- name: Send mail
  uses: action-pack/send-mail@v1
  with:
    # Specify connection via URL (replaces server_address, server_port, secure,
    # username and password)
    #
    # Format:
    #
    #  * smtp://user:password@server:port
    #  * smtp+starttls://user:password@server:port
    connection_url: ${{secrets.MAIL_CONNECTION}}
    # Required mail server address if not connection_url:
    server_address: smtp.gmail.com
    # Server port, default 25:
    server_port: 465
    # Optional whether this connection use TLS (default is true if server_port is 465)
    secure: true
    # Optional (recommended) mail server username:
    username: ${{secrets.MAIL_USERNAME}}
    # Optional (recommended) mail server password:
    password: ${{secrets.MAIL_PASSWORD}}
    # Required mail subject:
    subject: Github Actions job result
    # Required recipients' addresses:
    to: obiwan@example.com,yoda@example.com
    # Required sender full name (address can be skipped):
    from: Luke Skywalker # <user@example.com>
    # Optional plain body:
    body: Build job of ${{github.repository}} completed successfully!
    # Optional HTML body read from file:
    html_body: file://README.html
    # Optional carbon copy recipients:
    cc: kyloren@example.com,leia@example.com
    # Optional blind carbon copy recipients:
    bcc: r2d2@example.com,hansolo@example.com
    # Optional recipient of the email response:
    reply_to: luke@example.com
    # Optional Message ID this message is replying to:
    in_reply_to: <random-luke@example.com>
    # Optional unsigned/invalid certificates allowance:
    ignore_cert: true
    # Optional converting Markdown to HTML (set content_type to text/html too):
    convert_markdown: true
    # Optional attachments:
    attachments: attachments.zip,git.diff,./dist/static/*.js
    # Optional priority: 'high', 'normal' (default) or 'low'
    priority: low
    # Optional nodemailerlog: true/false
    nodemailerlog: false
    # Optional nodemailerdebug: true/false if true lognodem will also be set true
    nodemailerdebug: false
```

## Troubleshooting

### Gmail

Instead of using your normal Google password, use an App password.

1. [Enable 2-Step Verification.](https://support.google.com/accounts/answer/185839?hl=en&co=GENIE.Platform%3DAndroid).
This is needed to create an App password.
2. [Create an App password](https://support.google.com/accounts/answer/185833?hl=en) for `Mail`.

### Unauthenticated login (username/password fields)

The parameters `username` and `password` are set as optional to support self-hosted runners access to on-premise infrastructure. If
you are accessing public email servers make sure you provide a username/password authentication through [GitHub Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) to make the email delivery secure.

## Stars
[![Stars](https://starchart.cc/action-pack/send-mail.svg?variant=adaptive)](https://starchart.cc/action-pack/send-mail)
