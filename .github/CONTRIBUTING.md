# Contributing

We welcome any contributions to Tina, whether it be bug reports, feature requests, or code contributions. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Pull Request Process

1. Submit your PR to the `dev` branch. **Do not** submit PRs to the `main` branch.
2. Complete the PR checklist.
3. Ensure you are following the [Code of Conduct](CODE_OF_CONDUCT.md) at all times.
4. Await a review from a Tina maintainer or general user, as you see fit.

Your code will be merged into the `dev` branch once it has been reviewed, approved, and tested by a Tina maintainer.

## Pull Request/Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages.

When pair-programming or working on something with the help of somebody else, please add them as a Co-Author to your PR/commit, if simply out of the goodness of your heart.

##### Examples

###### Feature

Adding a new feature. Should be used when an external API is added as well.

`feat: added network layer`

###### Fix

Fixing an oversight (unreported bug).

`fix: network tokenization`

###### Bugfix

Fixing a bug.

`bugfix: network tokenization layer`

###### Refactor

Refactoring code, such as renaming variables, etc.

`refactor: ugly network layer`

###### Optimization

Minor/Major optimizations that don't count as refactors.

`speed: network layer string.byte`

###### Style

Fixing style issues, such as linting, formatting, etc.

`style: eslint fix`

###### Meta

Anything repository/workflow related.

`meta: add issue template`