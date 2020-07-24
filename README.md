# danger-action
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

## License
[MIT License](LICENSE).
