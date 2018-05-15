# ZScripts
A set of utility scripts for ease of development work.

## Installation
This package is available on `npm` repository. Install it locally or globally:

```sh
npm i zscripts
# or globally:
npm i -g zscripts
```

This will create a `zsc` command.

## Usage
To invoke it, use:

```sh
zsc [command] [options]
```

## Commands
- [`npm`](#npm-command)
- [`publish`](#publish-command)
- [`up`](#up-command)
- [`version'](#verison-command)

### Npm Command

#### Version

```sh
zsc npm version|v [...options]
```

##### Options

`-p, --patch`: Updates the patch version

`-m, --minor`: Updates the minor version

`-M, --major`: Updates the major version

> If no options are specified, defaults to patch.

### Publish Command

#### NPM
Publishes the current repository to NPM, using the Git tags' semantic versioning tags as the version in the `package.json`.

##### `zsc publish npm` Options

`-p, --private`: Sets the flag to release the package as private

`-y, --auto`: Publishes the package without confirmation

### Up Command

#### `zsc up` Options
All subcommands in the `up` command take in the following option flags:

`-P, --host-port [host-port]`: Specifies the host port for accessing the primary service, this usually defaults to the service's native port

`-l, --link [existing:in-app]`: Links containers to container being spun up

`-n, --name [name]`: Specifies the name of the container

`-U, --user-id [user-id]`: Specifies the user ID for the sonarqube instance

#### MySQL
Creates a local instance of MySQL.

```sh
zsc up mysql [...options]
```

> Default port: 3306

##### `zsc up mysql` Options

`-u, --username`: Specifies the username. Defaults to `"username"` when not defined.

`-p, --password`: Specifies the password for the user specified in `--username`. This is also used for the root password. Defaults to `"password"` when not defined.

#### Prometheus
Creates a local instance of Prometheus.

```sh
zsc up prometheus [...options]
```

> Default port: 9090

##### `zsc up prometheus` Options

`-c, --config-file-path`: Specifies a local absolute path to a configuration file for Prometheus to use. Defaults to `null` which means the Prometheus image uses the default file at `/etc/prometheus/prometheus.yml`

#### Redis
Creates a local instance of Redis.

```sh
zsc up redis [...options]
```

> Default port: 6379

##### `zsc up redis` Options

None.

#### Sonarqube
Creates a local instance of Sonarqube.

```sh
zsc up sonarqube [...options]
```

> Default port: 9000

##### `zsc up sonarqube` Options

`-Pdb, --host-port-db`: Specifies the port which will be host can expect to find the Sonarqube database. Defaults to `9092`.

### `version` Command
The `zsc version [...subcommand] [...options]` commands use Git tags to manage the version of a repository.

#### Version Bump
Bumps the version for the Git repository. Run this from inside any Git repository.

```sh
zsc version bump [...options]
```

##### `zsc version bump` Options

`-a, --alpha`: Does an alpha release (applicable only for pre-release version bumps)

`-b, --beta`: Does a beta release (applicable only for pre-release version bumps)

`-c, --release-candidate`: Does a release candidate release (applicable only for pre-release version bumps)

`-r, --pre-release`: Performs a pre-release version bump

`-o, --pre-patch [pre-patch-id]`: Performs a pre-patch version bump

`-p, --patch`: Performs a patch version bump

`-l, --pre-minor [pre-minor-id]`: Performs a pre-minor version bump

`-m, --minor`: Performs a minor version bump

`-L, --pre-major [pre-major-id]`: Performs a pre-major version bump

`-M, --major`: Performs a major version bump

#### Version Current
Outputs the current version according to the Git tags.

#### Version Next
Outputs the next version according to the Git tags.

##### `zsc version next` Options

`-a, --alpha`: Does an alpha release (applicable only for pre-release version bumps)

`-b, --beta`: Does a beta release (applicable only for pre-release version bumps)

`-c, --release-candidate`: Does a release candidate release (applicable only for pre-release version bumps)

`-r, --pre-release`: Performs a pre-release version bump

`-o, --pre-patch [pre-patch-id]`: Performs a pre-patch version bump

`-p, --patch`: Performs a patch version bump

`-l, --pre-minor [pre-minor-id]`: Performs a pre-minor version bump

`-m, --minor`: Performs a minor version bump

`-L, --pre-major [pre-major-id]`: Performs a pre-major version bump

`-M, --major`: Performs a major version bump

#### Version Init
Initialises version for the Git repository at `0.0.0`. Run this from inside any Git repository.

```sh
zsc version init
```

##### `zsc version init` Options

None.