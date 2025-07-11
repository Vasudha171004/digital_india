(() => {
  const defaultLang = 'en';
  const supportedLangs = ['en','hi','bn','te','mr','ta','gu','kn','ml','pa','or','ur'];

  // Load translations for the given language
  async function loadTranslations(lang) {
    try {
      if (!supportedLangs.includes(lang)) lang = defaultLang;
      const response = await fetch(`/lang/${lang}.json`)
      const translations = await response.json();
      applyTranslations(translations);
      localStorage.setItem('selectedLang', lang);
    } catch (err) {
      console.error('Error loading translations:', err);
    }
  }

  // Apply translations to elements with data-i18n
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = translations[key];

      if (value) {
        if (el.tagName === 'TITLE') {
          document.title = value;
        } else if (el.tagName === 'INPUT') {
          el.placeholder = value;
        } else if (el.hasAttribute("aria-label")) {
          el.setAttribute("aria-label", value);
        } else if (el.hasAttribute("alt")) {
          el.setAttribute("alt", value);
        } else if (el.hasAttribute("placeholder")) {
          el.setAttribute("placeholder", value);
        } else {
          el.textContent = value;
        }
      }
    });
  }

  // Initialize language selector and load saved/default language
  document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('languageSelect');
    const savedLang = localStorage.getItem('selectedLang') || defaultLang;

    if (selector) {
      selector.value = savedLang;
      selector.addEventListener('change', () => {
        loadTranslations(selector.value);
      });
    }

    loadTranslations(savedLang);
  });
})();
