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
- [`up`](#up-command)

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
