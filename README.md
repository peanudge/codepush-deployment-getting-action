# CodePush deployment getting action

This action get latest **code push deployment informations**

The reason why make this action instead of using directly CLI is that deployment result(JSON text) by Code Push CLI is array.

It`s sticky and cumbersome to filter specific element from JSON array using only git action expressions in workflow.

Support informations is

- Deployment Key

you can begin using **this key** to configure your mobile clients via their respective SDKs.

- Version label - `v123`
- Deployment name - `staging` or `production`
- All information JSON string

> ### CodePush CLI
>
> https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli#app-management

## Inputs

## `appcenter-token`

**Required** The Access Token of appcetner

## `deployment-name`

## `app-name`

**Required** `<ownername>/<appname>` ex) company/test-app

## Outputs

## `key`

Deployment Key

ex) `_wHuFKAZw6HmGQ9mZ_RAjy7fdtymH1wbmKAEN`

## `name`

Deployment Name

ex) `staging` or `production` etc.

## `version`

Version Label

ex) `v123`

## `mandatory`

This value is boolean whether this deployment is mandatory.

`true` or `false`

## `json`

This all deployment information JSON string

## Example usage

This example is simple workflow that get deployment version and tag using codepush version label.

Tag will be `company/test-app/v123`.

```yaml
- name: Generate Full App Name by Platform
    run: |
        echo "FULL_APP_NAME=company/test-app" >> $GITHUB_ENV

- name: Get CodePush Deployment
    id: deployment-job
    uses: peanut-lover/codepush-deployment-getting-action@v1.2
    with:
        appcenter-token: ${{ secrets.APPCENTER_ACCESS_TOKEN }}
        deployment-name: ${{ env.STAGE }}
        app-name: ${{ env.FULL_APP_NAME }}

- name: Create CodePush Version Tag
    run: echo "NEW_TAG=${{ env.FULL_APP_NAME }}/${{ steps.deployment-job.outputs.name }}/${{ steps.deployment-job.outputs.version }}" >> $GITHUB_ENV

- name: Append CodePush Version Tag
    uses: actions/github-script@v6
    with:
        script: |
            github.rest.git.createRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: 'refs/tags/${{ env.NEW_TAG }}',
            sha: context.sha
            })
```
