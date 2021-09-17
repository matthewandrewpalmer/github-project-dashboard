const dotenv = require("dotenv");


function getEnvironmentVariables() {
    if (process.env.NODE_ENV !== "production") {
        console.log("Environment is !production, using local .env file for environment variables")
        dotenv.config({path: __dirname + "/../.env"});
    }

    let {
        GITHUB_TOKEN,
        GIT_ORGANISATION,
        GIT_TEAM
    } = process.env;

    if (GITHUB_TOKEN === undefined) {
        console.error("GITHUB_TOKEN environment variable has not been set");
        GITHUB_TOKEN = "ENV_VAR_NOT_SET";
    }

    if (GIT_ORGANISATION === undefined) {
        console.error("GIT_ORGANISATION environment variable has not been set");
        GIT_ORGANISATION = "ENV_VAR_NOT_SET";
    }

    if (GIT_TEAM === undefined) {
        console.error("GIT_TEAM environment variable has not been set");
        GIT_TEAM = "ENV_VAR_NOT_SET";
    }
    return {
        GITHUB_TOKEN,
        GIT_ORGANISATION,
        GIT_TEAM
    };
}

module.exports = getEnvironmentVariables
