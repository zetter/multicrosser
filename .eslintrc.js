module.exports = {
  extends: ['airbnb'],
  root: true,
  env: {
    browser: true
  },
  settings: {
    "import/resolver": {
      "node": {
        "paths": ["app/javascript"]
      },
    }
  },
  rules: {
    "max-len": ["error", 120, 2],
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": "off"
  }
};
