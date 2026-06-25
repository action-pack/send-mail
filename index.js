const fs = require("fs");
const path = require("path");
const dns = require("dns");
const core = require("@actions/core");
const glob = require("@actions/glob");
const showdown = require("showdown");
const nodemailer = require("nodemailer");

function getBooleanInput(name) {
  return core.getInput(name, { required: false }).toLowerCase() === "true";
}

function getText(textOrFile, convertMarkdown) {
  let text = textOrFile || "";

  // Read text from file
  if (text.startsWith("file://")) {
    const file = text.replace("file://", "");
    text = fs.readFileSync(file, "utf8");
  }

  // Convert Markdown to HTML
  if (convertMarkdown) {
    const converter = new showdown.Converter();
    text = converter.makeHtml(text);
  }

  return text;
}

function getFrom(from, username) {
  if (/.+ <.+@.+>/.test(from)) {
    return from;
  }

  return `"${from}" <${username}>`;
}

async function getAttachments(attachments) {
  if (!attachments) {
    return undefined;
  }

  const globber = await glob.create(attachments.split(",").join("\n"));
  const files = await globber.glob();

  return files.map((file) => ({
    filename: path.basename(file),
    path: file,
    cid: path.basename(file),
  }));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Resolve the SMTP hostname to IPv4 before passing it to Nodemailer.
async function resolveIPv4(hostname) {
  const addresses = await dns.promises.resolve4(hostname);

  if (!addresses.length) {
    throw new Error(`No IPv4 address found for SMTP host '${hostname}'`);
  }

  return addresses[0];
}

async function main() {
  try {
    let secure = "true";
    let username = "";
    let password = "";
    let serverPort = "465";
    let serverAddress = "";
    let requireTLS = false;

    const connectionUrl = core.getInput("connection_url");

    if (connectionUrl) {
      const url = new URL(connectionUrl);

      switch (url.protocol) {
        case "smtp:":
          serverPort = "25";
          secure = "false";
          break;

        case "smtp+starttls:":
          serverPort = "587";
          secure = "false";
          requireTLS = true;
          break;

        case "smtps:":
          serverPort = "465";
          secure = "true";
          break;

        default:
          throw new Error(`Unsupported connection protocol '${url.protocol}'`);
      }

      if (url.hostname) {
        serverAddress = url.hostname;
      }

      if (url.port) {
        serverPort = url.port;
      }

      if (url.username) {
        username = decodeURIComponent(url.username);
      }

      if (url.password) {
        password = decodeURIComponent(url.password);
      }
    }

    const subject = core.getInput("subject", { required: true });
    const from = core.getInput("from", { required: true });
    const to = core.getInput("to", { required: false });
    const body = core.getInput("body", { required: false });
    const htmlBody = core.getInput("html_body", { required: false });
    const cc = core.getInput("cc", { required: false });
    const bcc = core.getInput("bcc", { required: false });
    const replyTo = core.getInput("reply_to", { required: false });
    const inReplyTo = core.getInput("in_reply_to", { required: false });
    const attachments = core.getInput("attachments", { required: false });
    const priority = core.getInput("priority", { required: false });

    const convertMarkdown = getBooleanInput("convert_markdown");
    const ignoreCert = getBooleanInput("ignore_cert");
    const nodemailerlog = getBooleanInput("nodemailerlog");
    const nodemailerdebug = getBooleanInput("nodemailerdebug");

    // If neither to, cc or bcc is provided, throw error.
    if (!to && !cc && !bcc) {
      throw new Error("At least one of 'to', 'cc' or 'bcc' must be specified");
    }

    if (!serverAddress) {
      throw new Error("Server address must be specified");
    }

    const originalServerAddress = serverAddress;
    serverAddress = await resolveIPv4(serverAddress);

    const transport = nodemailer.createTransport({
      host: serverAddress,
      name: "github.com",
      auth: username && password ? {
        user: username,
        pass: password,
      } : undefined,
      port: serverPort,
      secure: secure === "true",
      requireTLS,
      tls: {
        servername: originalServerAddress,
        ...(ignoreCert ? { rejectUnauthorized: false } : {}),
      },
      logger: nodemailerdebug || nodemailerlog,
      debug: nodemailerdebug,
    });

    for (let i = 1; ; i++) {
      try {
        await transport.sendMail({
          from: getFrom(from, username),
          to: to || undefined,
          subject: getText(subject, false),
          cc: cc || undefined,
          bcc: bcc || undefined,
          replyTo: replyTo || undefined,
          inReplyTo: inReplyTo || undefined,
          references: inReplyTo || undefined,
          text: body ? getText(body, false) : undefined,
          html: htmlBody ? getText(htmlBody, convertMarkdown) : undefined,
          priority: priority || undefined,
          attachments: await getAttachments(attachments),
        });

        break;
      } catch (error) {
        if (!error.message.includes("Try again later,") || i > 20) {
          core.setFailed(error.message);
          break;
        }

        console.log(`Received: ${error.message}`);
        console.log(`Trying again in ${i === 1 ? "a minute" : `${i} minutes`}...`);

        await sleep(i * 60000);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
