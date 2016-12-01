# Atom nuxeo-documentation-links package

Provides suggestions for `{{file ...}}` and `{{page ...}}` links.

Taken from `editor.json` which is produced by the documentation build.

## Installation

- Close Atom
- Clone the package repository
  ```
  pushd ~;
  mkdir -p github && cd $_;
  git clone https://github.com/nuxeo/atom-documentation-links atom-documentation-links;
  apm link atom-documentation-links;
  ```
- Open Atom

## Config
`Cmd + ,`/`Ctrl + ,` for _Settings_ > _Packages_, search for 'Nuxeo' > _Settings_. Set the path/url to be the most recent build.


## Debugging
run Atom with `-d` flag.
```
atom -d
```

`Ctrl + Shift + i` Inspector > Console.
```
localStorage.debug = 'nuxeo-documentation-links*'
```
