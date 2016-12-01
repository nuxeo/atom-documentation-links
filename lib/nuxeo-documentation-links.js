'use babel';

/* global atom */

// debugging
const debugLib = require('debug');
const debugId = 'nuxeo-documentation-links';
const debug = debugLib(`${debugId}`);
const error = debugLib(`${debugId}:error`);
const info = debugLib(`${debugId}:info`);

// npm packages
const path = require('path');
const fs = require('fs');
const url = require('url');
const request = require('request');

let assets;


info('start');

const filePrefixMatch = /\{\{file (.+)/;
const pagePrefixMatch = /\{\{page (.+)/;

const hasTitle = item => item && item.title;
const isFile = item => item && !item.title;
const notRedirect = item => item && !item.redirect;

const getPrefix = (atomRequest, prefix_match) => {
  const {editor, bufferPosition} = atomRequest;

  // Get the text for the line up to the triggered buffer position
  const text = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
  const match = prefix_match.exec(text);
  debug('request', editor, 'bufferPosition', bufferPosition, 'text', text, 'match', match);

  // Match the regex to the line, and return the match
  return match && match[0];
};

const processJsonFile = (err, body) => {
  info('processJSON');
  if (err) {
    error('Asset file:', err);
    assets = null;
  }
  else {
    assets = JSON.parse(body);
    debug('assets', assets);
  }
};

const processJsonUrl = (err, res, body) => {
  if (!err && (res.statusCode === 200 || res.statusCode === 304)) {
    processJsonFile(err, body);
  }
};


const completion_provider = {
  selector          : '.text.html, .source.gfm',
  disableForSelector: 'text.html .comment',
  filterSuggestions : true,
  loadCompletions   : () => {
    const jsonPath = atom.config.get('nuxeo-documentation-links.assetsJsonPath');
    const urlObject = url.parse(jsonPath);
    if (urlObject.protocol && urlObject.host) {
      info('Asset url', jsonPath);
      request(jsonPath, processJsonUrl);
    }
    else {
      info('Asset file path', jsonPath);
      fs.readFile(path.normalize(jsonPath), processJsonFile);
    }
    info('Nuxeo Documentation Links Initialised');
    // completions['file-index'] = "{{file 'logo.png' page='index'}}";
    return;
  },
  getSuggestions: (atomRequest) => {
    return new Promise((resolve, reject) => {
      const filePrefix = getPrefix(atomRequest, filePrefixMatch);
      const pagePrefix = getPrefix(atomRequest, pagePrefixMatch);

      if (!filePrefix && !pagePrefix) {
        debug('No Prefix');
        // No matched prefix so resolve nothing
        return resolve([]);
      }
      else if (pagePrefix) {
        /*
        id: "form-layouts"
        is_redirect: false
        space: "studio"
        title: "Form Layouts"
        url: "/studio/form-layouts/"
        version: ""
        */

        return resolve(assets
          .filter(hasTitle)
          .filter(notRedirect)
          .map((item) => {
            const suggestion = {
              type             : 'snippet',
              replacementPrefix: pagePrefix
            };
            suggestion.rightLabel = item.title;
            suggestion.text = `{{page version='${item.version}' space='${item.space}' page='${item.id}'`;
            suggestion.description = `page ${item.url}`;
            return suggestion;
          })
        );
      }
      else if (filePrefix) {
        /*
        id: "AdminCenter-offline-registration-done.png"
        page: "registering-your-nuxeo-instance"
        space: "admindoc"
        url: "/710/admindoc/registering-your-nuxeo-instance/AdminCenter-offline-registration-done.png"
        version: "710"
        */

        return resolve(assets
          .filter(isFile)
          .filter(notRedirect)
          .map((item) => {
            const suggestion = {
              type             : 'snippet',
              replacementPrefix: filePrefix
            };
            suggestion.text = `{{file version='${item.version}' space='${item.space}' page='${item.page}' '${item.id}'`;
            suggestion.description = `file ${item.url}`;
            return suggestion;
          })
        );
      }
      return reject('Missing case');
    });
  }
};

export default {
  config: {
    assetsJsonPath: {
      order      : 1,
      title      : 'Path of the assets JSON',
      description: 'Often `editor.json`\n_Note: `~` does not work, use: `/home/...`',
      type       : 'string',
      default    : './editor.json'
    }
  },

  activate: () => {
    return completion_provider.loadCompletions();
  },

  getProvider: () => {
    debug('starting');
    return completion_provider;
  }
};
