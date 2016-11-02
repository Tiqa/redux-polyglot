# Contributing

[react-redux-polyglot](https://github.com/Tiqa/react-redux-polyglot) use [redux-polyglot](https://github.com/Tiqa/redux-polyglot) as main dependency, so we work on a [dev branch](https://github.com/Tiqa/redux-polyglot/tree/dev) for staging and need to follow this __3 principles__ :
- this branch must be as clean as master, so `npm run prepublish` must be ok.
- all master merges should be tagged by a new version. (on the master branch only)
- all change must be validated by [react-redux-polyglot](https://github.com/Tiqa/react-redux-polyglot) unit testing before merge on master

--------------

1.  Fork the project and clone your fork.

2.  Create a local feature branch:

        $ git checkout -b <branch>

3.  Make one or more atomic commits. Do not commit changes to
    __dist/*__.

4.  Run `npm test` and address any errors. It will install
    needed dependencies locally.  Preferably, fix commits in place using `git
    rebase` or `git commit --amend` to make the changes easier to review and to
    keep the history tidy.

5.  Push to your fork:

        $ git push origin <branch>

6.  Open a pull request on [dev](https://github.com/Tiqa/redux-polyglot/tree/dev) branch.

----------------

Please read semver.org
