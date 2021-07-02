# Contributing to ML-CLI

We would love to see you contributing to ML-CLI and help to improve it. As a contributor, you should follow our [**code of conduct**](CODE_OF_CONDUCT.md).

# Code quality and rules

Please follow these guidelines:
* All features or bug fixes **must be tested** by one or more unit-tests.
* Code coverage **must be at least** 60 %.
* All public methods **must be documented**.

# Add a new feature ?

You can request a new feature by submitting an issue to our Github repository. If you would like to implement it yourself, please consider the following:
* for a Major Feature, please open an issue and express your proposal so that it can be discussed with other contributors. This prevents work duplication, improves coordination, and helps you to craft the change so that it is perfectly adapted to the project.
* for a Minor Feature, you can directly craft it and submit a pull request.

#Pull Requests

We like to see pull requests that:
* Maintain the existing code style
* Are focused on a single change (i.e avoid large refactoring or style adjustments in untouched code if not the primary goal of the pull request)
* Have [good commit messages][commit-messages]
* Have tests
* Don't decrease the current code coverage

#Running tests

**Frontend**

Run frontend tests with ```npm run test``` in the diffmatchpatch folder.

**Backend**

Run backend tests with ``` dotnet test ``` in the src folder.

# Found a Bug ? 

You can help us by submitting an issue to our [**Azure repository**][repo].\
If you are able to solve it, please feel free to submit a pull request with the fix !

[commit-messages]: https://chris.beams.io/posts/git-commit/
[repo]: https://axafrance.visualstudio.com/SquadNSD/_git/ml-cli