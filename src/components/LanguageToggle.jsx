import { useI18n } from '../i18n/I18nProvider.jsx';
import { track } from '../lib/analytics.js';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  const switchTo = (next) => {
    if (next === lang) return;
    track('lang_switch', { from: lang, to: next });
    setLang(next);
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={'lang-toggle-btn' + (lang === 'pt' ? ' is-active' : '')}
        aria-pressed={lang === 'pt'}
        onClick={() => switchTo('pt')}
      >
        PT
      </button>
      <span className="lang-toggle-sep" aria-hidden="true">/</span>
      <button
        type="button"
        className={'lang-toggle-btn' + (lang === 'en' ? ' is-active' : '')}
        aria-pressed={lang === 'en'}
        onClick={() => switchTo('en')}
      >
        EN
      </button>
    </div>
  );
}
