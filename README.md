# danger-action test2
![](https://github.com/MeilCli/danger-action/workflows/CI/badge.svg)  
JavaScript based running [danger](https://github.com/danger/danger) action for GitHub Actions.  

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
    # ↓↓↓ if using bundle cache when danger plugins install ↓↓↓
    - uses: actions/cache@v1
      with:
        path: vendor/bundle
        key: ${{ runner.os }}-gems-${{ hashFiles('Gemfile') }} # change your gemfile path
        restore-keys: |
          ${{ runner.os }}-gems-
    - name: Bundle config
      run: bundle config path vendor/bundle
    # ↑↑↑ if using bundle cache when danger plugins install ↑↑↑
    - uses: MeilCli/danger-action@v3
      with:
        plugins_file: 'Gemfile'
        danger_file: 'Dangerfile'
        danger_id: 'danger-pr'
      env:
        DANGER_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## input
- `danger_version`
  - optional
  - version information with gem styled
  - default: `>= 6.0.0`
- `plugins_file`
  - optional
  - gemfile path for danger plugin. if set plugins_file, action do not exec `gem install danger`
- `danger_file`
  - required
  - dangerfile path for running danger
- `danger_id`
  - required
  - danger id is an identifier string, example(`danger-pr`, `danger-CI`, etc..)
- `fail_on_stderr_when_danger`
  - optional
  - action fail when danger output stderr
  - default: `false`
  
## env
- `DANGER_GITHUB_API_TOKEN`
  - required
  - GitHub Token using by Danger
  - recommendation value: `${{ secrets.GITHUB_TOKEN }}`

## License
[MIT License](LICENSE).
