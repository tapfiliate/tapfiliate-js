# Releasing

`@tapfiliate/tapfiliate-js` is published to npm by GitHub Actions when a GitHub release is published
(`.github/workflows/publish.yml`). npm trusts that workflow directly ([trusted publishing](https://docs.npmjs.com/trusted-publishers)):
there is no npm token anywhere, and every version gets a [provenance statement](https://docs.npmjs.com/generating-provenance-statements)
that links it to the commit it was built from. Nobody publishes from a laptop.

The package loads the Tapfiliate tracking script on customers' websites, and many of them install it with
`^1.x`, so a new 1.x version reaches them without any action on their side. Treat every release accordingly.

## Release a new version

1. In a pull request, make the change, bump `version` in `package.json` and add an entry to the Changelog
   in `README.md`. Follow semver: anything that can break an existing integration is a new major version.
2. Merge the pull request once the Test workflow is green (Node 18, 20.10, 22 and 24).
3. Create a GitHub release from `master` with the tag `v` + the version, for example `v1.0.4`
   (Releases → Draft a new release, or `gh release create v1.0.4 --target master`). Publishing the release
   starts the Publish workflow; it fails if the tag does not match `package.json`.

## Check the result

The workflow takes about a minute; npm needs a few more minutes before the version is visible.

```bash
npm view @tapfiliate/tapfiliate-js dist-tags.latest   # the new version
npm audit signatures                                  # in a project that installs it: provenance verified
```

Install the new version in an empty project on Node 18 and check that both `require('@tapfiliate/tapfiliate-js')`
and `import Tap from '@tapfiliate/tapfiliate-js'` load and expose `init`. The npmjs.com page itself can show the
previous version for a while after the registry already has the new one.

## If something goes wrong

- **The Publish workflow failed before `npm publish`** (tests, tag mismatch): nothing reached npm. Delete the
  release and its tag, fix the cause on `master`, and create the release again.
- **`npm publish` failed with an authentication error:** the trusted publisher settings on npmjs.com
  (package → Settings → Trusted Publisher) must name this repository and the workflow file `publish.yml`.
  Renaming the workflow file breaks publishing until the setting is updated.
- **A broken version is already on npm:** a version number can never be reused. Publish a fixed patch version
  through the same steps; if users must be warned, deprecate the broken version with
  `npm deprecate @tapfiliate/tapfiliate-js@<version> "<reason>"`. Do not unpublish: installs pinned to that
  version would break.
