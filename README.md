# danger-action
![](https://github.com/MeilCli/danger-action/workflows/CI/badge.svg)  
JavaScript based running [danger](https://github.com/danger/danger) action for GitHub Actions.  
**This action is unofficial.**

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
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-ruby@v1
        with:
          ruby-version: '2.6'
      - uses: MeilCli/danger-action@v1
        with:
          plugins_file: 'Gemfile'
          danger_file: 'Dangerfile'
          danger_id: 'danger-pr'
        env:
          DANGER_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
- if multiple trigger workflow, use if condition `if: github.event_name  == 'pull_request'`
  - example is [this repository's workflow](.github/workflows/build.yml)

## input
- `danger_version`
  - optional
  - version information with gem styled
  - default: `>= 6.0.0`
- `plugins_file`
  - optional
  - gemfile path for danger plugin
- `danger_file`
  - required
  - dangerfile path for running danger
- `danger_id`
  - required
  - danger id is an identifier string, example(`danger-pr`, `danger-CI`, etc..)
  
## env
- `DANGER_GITHUB_API_TOKEN`
  - required
  - GitHub Token using by Danger
  - recommendation value: `${{ secrets.GITHUB_TOKEN }}`

## License
[MIT License](LICENSE).
