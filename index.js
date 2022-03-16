const core = require("@actions/core");
const github = require("@actions/github");
const { exec } = require("child_process");
try {
  const appcenterToken = core.getInput("appcenter-token");
  const deploymentName = core.getInput("deployment-name");
  const appName = core.getInput("app-name");

  exec(
    `appcenter login --token ${appcenterToken}`,
    function (error, stdout, stderr) {
      if (error) {
        core.setFailed(error);
        return;
      }
      exec(
        `appcenter codepush deployment list --app ${appName} --output json`,
        function (error, stdout, stderr) {
          if (error) {
            core.setFailed(error);
            return;
          }
          const deployments = JSON.parse(stdout);
          const selectedDeployment = deployments.find(
            (deployment) => deployment.name === deploymentName
          );
          if (!selectedDeployment) {
            core.setFailed(
              `Not found deployment with "${deploymentName}" name`
            );
            return;
          }
          core.setOutput("deployment", selectedDeployment);
        }
      );
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
