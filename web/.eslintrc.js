module.exports = {
  "extends": [ 
    "airbnb",
    "plugin:react/recommended",
  ],
  parser: "babel-eslint",
  globals: {
    App: true,
    MediaItem: true,
    Player: true,
    Playlist: true,
    canOpenURL: true,
    formatDate: true,
    formatDuration: true,
    openURL: true,
    // This is used/overridden by webpack for environment specification
    ENV: true,
  },
  env: {
    "browser": true,
  },
  rules: {
    'no-console': [0], // turned off for now while we are console.logging everywhere.
    'jsx-a11y/alt-text': [0], // There is not alt text on appletv
    'react/jsx-filename-extension': [0],
    'react/destructuring-assignment': [0],
    'react/button-has-type': [0], // TVML does not have a type attribute for <button>
    'react/no-unknown-property': [0], // TVML does not do className => class
    'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
  },  
};