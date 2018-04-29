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
- [`up`](#up-command)

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

### Up Command
#### MySQL

```sh
zsc up mysql [...options]
```

##### Options

`-u, --username`: Specifies the username. Defaults to `"username"` when not defined.

`-p, --password`: Specifies the password for the user specified in `--username`. This is also used for the root password. Defaults to `"password"` when not defined.

`-P, --host-port`: Specifies the port which will be host can expect to find the MySQL instance. Defaults to `3306`

#### Redis

```sh
zsc up redis [...options]
```

##### Options

`-P, --host-port`: Specifies the port which will be host can expect to find the Redis instance. Defaults to `6379`.

#### Sonarqube

```sh
zsc up sonarqube [...options]
```

##### Options

`-Pui, --host-port-ui`: Specifies the port which will be host can expect to find the Sonarqube UI. Defaults to `9000`.

`-Psv, --host-port-server`: Specifies the port which will be host can expect to find the Sonarqube server. Defaults to `9092`.
