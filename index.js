const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("token");
const octokit = github.getOctokit(token);

const name = core.getInput("name");
const value = core.getInput("value");

const context = github.context;
const repoName = context.payload.repository.name;
const ownerName = context.payload.repository.owner.login;

let repository = core.getInput("repository");
if (repository === "false") repository = repoName;

let owner = core.getInput("owner");
if (owner === "false") owner = ownerName;

const push_to_org = core.getInput("org") !== "false";

function path_() {

  if (push_to_org) return "/orgs/" + owner;
  if (repository.includes("/")) return "/repos/" + repository;

  return "/repos/" + owner + "/" + repository;

}

const createVariable = (data) => {

  let url = "POST " + path_();
  url += "/actions/variables";

  return octokit.request(url, {
    owner: owner,
    repo: repository,
    name: name,
    value: data,
  });
};

const setVariable = (data) => {

  let url = "PATCH " + path_();
  url += "/actions/variables/" + name;

  return octokit.request(url, {
    owner: owner,
    repo: repository,
    name: name,
    value: data,
  });
};

const getVariable = (varname) => {

  let url = "GET " + path_();
  url += "/actions/variables/" + varname;

  return octokit.request(url, {
    owner: owner,
    repo: repository,
    name: varname,
  });
};

const bootstrap = async () => {

  let exists = false;

  try {

    const response = await getVariable(name);
    exists = response.status === 200;

  } catch (e) {
    // Variable does not exist
  }

  try {

    if (exists) {

      const response = await setVariable(value);

      if (response.status === 204) {
        return "Succesfully updated variable " + name + " to " + value;
      }

      throw new Error("ERROR: Wrong status was returned: " + response.status);

    } else {

      const response = await createVariable(value);

      if (response.status === 201) {
        return "Succesfully created variable " + name + " with value " + value;
      }

      throw new Error("ERROR: Wrong status was returned: " + response.status);

    }

  } catch (e) {
    core.setFailed(path_() + ": " + e.message);
    console.error(e);
  }
};

bootstrap()
  .then(
    (result) => {
      // eslint-disable-next-line no-console
      if (result != null) {
        console.log(result);
      }
    },
    (err) => {
      // eslint-disable-next-line no-console
      core.setFailed(err.message);
      console.error(err);
    },
  )
  .then(() => {
    process.exit();
  });
