// build/production configuration extends default/development configuration
module.exports = {
    extends: [
      "./.eslintrc.js",
      "plugin:eslint-comments/recommended"
    ],
    rules: {
      "eslint-comments/no-unused-disable": "warn",
      // "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-debugger": "error"
    }
};
