module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-console": 0
  },
  "globals": {
    "atom": true,
    "beforeEach": true,
    "afterEach": true,
    "expect": true,
    "describe": true,
    "it": true,
    "jasmine": true,
    "runs": true,
    "spyOn": true,
    "waits": true,
    "waitsFor": true,
    "waitsForPromise": true
  }
};
