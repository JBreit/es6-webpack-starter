module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "rules": {
    "comma-dangle": ["error", "never"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", process.env.NODE_ENV === "production" ? "unix" : "windows"]
  }
};
