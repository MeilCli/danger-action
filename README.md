# danger-action
This repository is danger for GitHub Actions.

## Required
This action must set-up [Ruby](https://github.com/actions/setup-ruby) and Bundler.

Recommendation: set up Ruby 2.6 or higher

## input
- `danger_version`
  - optional
  - version information with gem styled
- `plugins_file`
  - optional
  - gemfile path for danger plugin
- `danger_file`
  - required
  - dangerfile path for running danger
- `danger_id`
  - required
  - danger id is an identifier string, example(`danger-pr`, `danger-CI`, etc..)

## License
MIT License.