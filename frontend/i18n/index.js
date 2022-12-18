
const options = {
  locales: [
    {
      name: 'Polish',
      code: 'pl',
      iso: 'pl-PL',
      file: 'pl'
    },
    {
      name: 'English',
      code: 'en',
      iso: 'en-CA',
      file: 'en'
    },
    {
      name: '中文',
      code: 'zh',
      iso: 'zh-CN',
      file: 'zh'
    },
    {
      name: 'Français',
      code: 'fr',
      iso: 'fr-CA',
      file: 'fr'
    },
    {
      name: 'Deutsch',
      code: 'de',
      iso: 'de-DE',
      file: 'de'
    }
  ],
  lazy: true,
  langDir: 'i18n/',
  defaultLocale: 'pl',
  vueI18n: {
    fallbackLocale: 'pl'
  },
  detectBrowserLanguage: false
}

export default options
