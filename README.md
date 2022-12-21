# danger-action
[![CI-Master](https://github.com/MeilCli/danger-action/actions/workflows/ci-master.yml/badge.svg)](https://github.com/MeilCli/danger-action/actions/workflows/ci-master.yml)  
Execute [danger](https://github.com/danger/danger) action for GitHub Actions.  

## Required
This action must set-up [Ruby](https://github.com/actions/setup-ruby) and Bundler.

Recommendation: set up Ruby 2.6 or higher

## Example
```yml
name: CI

on:
  pull_request:
    branches:
      - master
      
jobs:
  danger:
    runs-on: ubuntu-latest
    if: github.event_name  == 'pull_request' # if only run pull request when multiple trigger workflow
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-ruby@v1
      with:
        ruby-version: '2.6'
    - uses: actions/cache@v1
      with:
        path: vendor/bundle
        key: ${{ runner.os }}-gems-${{ hashFiles('Gemfile') }} # change your gemfile path
        restore-keys: |
          ${{ runner.os }}-gems-
    - uses: MeilCli/danger-action@v5
      with:
        plugins_file: 'Gemfile'
        install_path: 'vendor/bundle'
        danger_file: 'Dangerfile'
        danger_id: 'danger-pr'
      env:
        DANGER_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
You can also pin to a [specific release](https://github.com/MeilCli/danger-action/releases) version in the format `@v5.x.x`

## input
- `danger_version`
  - optional
  - version information with gem styled
  - default: `>= 6.0.0`
- `danger_version_file`
  - optional
  - danger version file
  - default: `.tool-versions`
- `danger_version_file_format`
  - optional
  - danger version file format. [more detail](./docs/danger-version-file.md)
  - default: `asdf`
- `plugins_file`
  - optional
  - gemfile path for danger plugin. if set plugins_file, action do not exec `gem install danger`
- `install_path`
  - optional
  - bundle install path, Useful instead of `bundle config path`
- `danger_file`
  - required
  - dangerfile path for running danger
- `danger_id`
  - required
  - danger id is an identifier string, example(`danger-pr`, `danger-CI`, etc..)
- `fail_on_stderr_when_bundler`
  - optional
  - action fail when bundler output stderr
  - default: `false`
- `fail_on_stderr_when_danger`
  - optional
  - action fail when danger output stderr
  - default: `false`
  
## env
- `DANGER_GITHUB_API_TOKEN`
  - required
  - GitHub Token using by Danger
  - recommendation value: `${{ secrets.GITHUB_TOKEN }}`

## Additional Example
```yml
name: CI

on:
  pull_request:
    branches:
      - master
      
jobs:
  danger:
    runs-on: ubuntu-latest
    if: github.event_name  == 'pull_request' # if only run pull request when multiple trigger workflow
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-ruby@v1
      with:
        ruby-version: '2.6'
    - uses: actions/cache@v1
      with:
        path: vendor/bundle
        key: ${{ runner.os }}-gems-${{ hashFiles('.github/Gemfile') }} # change your gemfile path
        restore-keys: |
          ${{ runner.os }}-gems-
    - uses: MeilCli/danger-action@v5
      with:
        plugins_file: '.github/Gemfile'
        install_path: 'vendor/bundle'
        danger_file: '.github/Dangerfile'
        danger_id: 'danger-pr'
      env:
        DANGER_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
danger-action can escape path of `Gemfile`. so you can put Gemfile on no-current directory.

## Attention: For repository OSS or using dependabot
`github-actions` token has not write permission at triggered by `pull_request` that created from forked repository or created by dependabot. This reason is for security

ref: [Keeping your GitHub Actions and workflows secure: Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)

In this case, danger cannot use GitHub API because readonly token. And, Using `pull_request_target` is an option, but it have the security concerns.

If your needs is report of lint-result, recommending [MeilCli/common-lint-reporter](https://github.com/MeilCli/common-lint-reporter). Its action resolve this problem by using `workflow_run`.
see: [More information](https://github.com/MeilCli/common-lint-reporter/blob/master/documents/oss-or-dependabot-usage.md)

## Contributes
[<img src="https://gist.github.com/MeilCli/43c9ea6a92b6ae29bab864c4917824d8/raw/6ef53834e0a5dabf5809900865e4063db96e5841/metrics_contributors.svg">](https://github.com/MeilCli/danger-action/graphs/contributors)

### Could you want to contribute?
see [Contributing.md](./.github/CONTRIBUTING.md)

## License
[<img src="https://gist.github.com/MeilCli/43c9ea6a92b6ae29bab864c4917824d8/raw/6ef53834e0a5dabf5809900865e4063db96e5841/metrics_licenses.svg">](LICENSE)
