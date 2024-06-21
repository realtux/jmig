# jmig 0.0.1 by [tux](https://github.com/realtux)

jmig is a simple mysql and postgres migrations manager

## installation

```
# install globally
npm i -g jmig

# install into your project
npm i --save jmig
```

## configuration

configuration can be done with `jmig init` to generate a `config.json`. alternatively, jmig can read from your environment
for relevant details. those environment variables are as follows:

```
JMIG_DRIVER
JMIG_HOST
JMIG_PORT
JMIG_USERNAME
JMIG_PASSWORD
JMIG_DB
```

this option is very useful when config consolidation is important or configuration is done with `.env` files,
docker environment, or docker compose files.

please note that `config.json` won't be combined with your environment. if `config.json` exists, jmig will use
that first, other it will fall back to environment variables.

## jmig commands

### initialize jmig
```
jmig init
```
this will ask you a few questions and create a `config.json` file in the current directory as long
as one doesn't already exist. if one already exists, jmig will say so and the program will exit.

***options***

`-f` force init and overwrite `config.json` if it exists

***generated json***
```json
{
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "db": "mydb",
  "platform": "mysql"
}
```
your data will vary according to what you've put in either manually or via `jmig init`.

#

### create a new migration
```
jmig create [name]
```
this will create a new file in the format of `[timestamp]-[name].sql` in the migrations folder.
the name can be a single word, multiple words, or whatever you'd like. each space is replaced with a dash.
for instance, `jmig create my new migration` will result in a migration named `[timestamp]-my-new-migration.sql`.
it will contain an `up:` and `down:` label. there must be a newline after each label and a newline
after each command you write. if you don't have an `up` or a `down`, you can leave the label out of
the migration, or leave it blank; either way is fine.

#

### check the status of each migration
```
jmig status
```
this will check each migration in the migrations folder
and compare that against what is in the `jmig` table that `jmig` will create in the
beginning. migrations that are present in the table will be marked as `up` and
migrations that are not will be marked as `dn`. a count of pending migrations will be shown.

#

### apply all pending migrations
```
jmig migrate
```
this will run each migration marked as `dn` from `jmig status` and execute the contents from
the `up:` label located in that migration. if multiple migrations are marked as `dn`,
they will be ran sequentially starting with the oldest.

#

### rolling back migrations
```
jmig rollback
```
this will rollback each migration marked as `up` from `jmig status` and execute
the contents from the `down:` label located in that migration. by default, only the most
recently migration will be rolled back.

#

### license

jmig is available under the MIT License
