module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
<<<<<<< HEAD
    'no-console': process.env.NODE_ENV === 'production' ? 1 : "off",
=======
    'no-console': 1
>>>>>>> f7e5193c35de698b998a406c59814d3872b07289
  }
}
