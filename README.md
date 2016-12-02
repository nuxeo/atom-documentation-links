# Atom nuxeo-documentation-links package

Provides suggestions for `{{file ...}}` and `{{page ...}}` links.

Taken from `editor.json` which is produced by the documentation build.

![Example Animation](https://github.com/nuxeo/atom-documentation-links/raw/master/documentation-links.gif)

## Installation
### Within Atom

`cmd + ,` or `ctrl + ,` for _Settings_ > _Install Packages_ > Search for **nuxeo-documentation-links** and _Install_.

### Command line
```
apm install nuxeo-documentation-links
```

## Config
`Cmd + ,`/`Ctrl + ,` for _Settings_ > _Packages_, search for 'Nuxeo' > _Settings_. Set the path/url to a local path or use the default which is the latest live version.


## Debugging
run Atom with `-d` flag.
```
atom -d
```

`Ctrl + Shift + i` Inspector > Console.
```
localStorage.debug = 'nuxeo-documentation-links*'
```
