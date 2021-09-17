const express = require('express')
const {Octokit} = require("@octokit/core");
const lodash = require('lodash');
const getEnvironmentVariables = require("../Config");
const router = express.Router();

const {GITHUB_TOKEN, GIT_ORGANISATION, GIT_TEAM} = getEnvironmentVariables();

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

function GitHubHandler() {
    router.get("/api/user", getUserInfo);
    router.get("/api/user/orgs", getUsersOrganisations);
    router.get("/api/pulls/:owner/:repo", getPullRequestsForRepo);
    router.get("/api/pulls", getPullRequestsForAllTeamRepositories);
    router.get("/api/projects", getListOfTeamRepositories);
    return router;
}

async function getUsersOrganisations(req, res) {
    console.log("Get users organisations");

    octokit.request(`/user/orgs`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    })
        .then(function (response) {
            console.log("Retrieved users organisations");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve users organisations");
            console.error(error);
            return res.status(500).json(error);
        });
}

async function getUserInfo(req, res) {
    console.log("Get user info");

    octokit.request("/user")
        .then(function (response) {
            console.log("Retrieved user information");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve user information");
            console.error(error);
            return res.status(500).json(error);
        });
}

async function getPullRequestsForRepo(req, res) {
    let {owner, repo} = req.params;
    console.log(`Get pull requests for ${repo} items`);

    getRepositoryPulls(owner, repo)
        .then(([success, data]) => {
            if (success) {
                return res.json(data);
            }
            return res.status(500).json(data);
        })
}

async function getPullRequestsForAllTeamRepositories(req, res) {
    console.log("Get all pull requests");

    octokit.request(`/orgs/${GIT_ORGANISATION}/teams/${GIT_TEAM}/repos?per_page=50`, {
        headers: {
            Accept: "application/vnd.github.inertia-preview+json"
        }
    })
        .then(async function (response) {
            let list = response.data

            console.log(`Retrieved repo list, ${list.length} item/s`);

            lodash.remove(list, function (item) {
                return item.archived
            });

            lodash.remove(list, function (item) {
                return item.open_issues_count === 0
            });

            console.log(`Filtered repo list down to, ${list.length} item/s`);

            const pullRequests = [];

            for (const repo of list) {
                const [success, list] = await getRepositoryPulls(GIT_ORGANISATION, repo.name)
                if (success) {
                    for (const pr of list) {
                        pr.repository = repo.name
                    }
                    repo.pulls = list
                    pullRequests.push(...list)
                }
            }

            // list = lodash.sortBy(list, ['open_issues_count']).reverse();
            // let list = lodash.remove(response.data, function(project) {
            //     return !project.name.search("^blaise");
            // });

            return res.json(pullRequests);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve all pull requests list");
            console.error(error);
            return res.status(500).json(error);
        });
}

async function getListOfTeamRepositories(req, res) {
    console.log("Get list of repositories");

    octokit.request(`/orgs/${GIT_ORGANISATION}/teams/${GIT_TEAM}/repos?per_page=50`, {
        headers: {
            Accept: "application/vnd.github.inertia-preview+json"
        }
    })
        .then(async function (response) {
            console.log(`Retrieved repo list, ${response.data.length} item/s`);

            let list = response.data
            list = lodash.sortBy(list, ['open_issues_count']).reverse();
            return res.json(list);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve Repository list");
            console.error(error);
            return res.status(500).json(error);
        });
}


function getRepositoryPulls(owner, repository) {
    return new Promise((resolve) => {
        octokit.request(`/repos/${owner}/${repository}/pulls`, {
            headers: {
                Accept: "application/vnd.github.inertia-preview+json"
            }
        })
            .then(function (response) {
                console.log(`${response.data.length} pull request/s for Repository: ${repository}`);
                let list = response.data
                resolve([true, list]);
            })
            .catch(function (error) {
                // handle error
                console.error(`Failed to retrieve pull request list for ${repository}`);
                console.error(error);
                resolve([false, []]);
            });
    });
}


module.exports = GitHubHandler;