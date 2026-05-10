import { useState } from 'react';
import { useT, useI18n } from '../i18n/I18nProvider.jsx';
import { track } from '../lib/analytics.js';

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(field, value) {
  if (field === 'email') {
    const v = value.trim();
    if (!v) return 'emailRequired';
    if (!EMAIL_RE.test(v)) return 'emailInvalid';
    return null;
  }
  if (field === 'whatsapp') {
    const v = value.trim();
    if (!v) return null; // optional
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) return 'whatsappInvalid';
    return null;
  }
  return null;
}

export function Waitlist() {
  const t = useT();
  const { lang } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [data, setData] = useState({
    email: '',
    fleet: '10-50',
    whatsapp: '',
  });
  const [touched, setTouched] = useState({});

  const errors = {
    email: validate('email', data.email),
    whatsapp: validate('whatsapp', data.whatsapp),
  };
  const hasErrors = Boolean(errors.email || errors.whatsapp);

  function setField(field, value) {
    setData((d) => ({ ...d, [field]: value }));
    setSubmitError(null);
  }

  function markTouched(field) {
    setTouched((tt) => ({ ...tt, [field]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    // Reveal any pristine-field errors on submit attempt.
    setTouched({ email: true, whatsapp: true });
    track('waitlist_submit_attempt', { fleet: data.fleet, has_whatsapp: !!data.whatsapp.trim(), lang });
    if (hasErrors) {
      track('waitlist_validation_error', {
        email_error: errors.email || null,
        whatsapp_error: errors.whatsapp || null,
      });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    if (FORMSPREE) {
      try {
        const res = await fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, email: data.email.trim(), whatsapp: data.whatsapp.trim() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        setSubmitting(false);
        setSubmitError(t('waitlist.errors.submitFailed'));
        track('waitlist_submit_error', { reason: err?.message || 'network' });
        return;
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    track('waitlist_submit_success', {
      fleet: data.fleet,
      has_whatsapp: !!data.whatsapp.trim(),
      lang,
      stub: !FORMSPREE,
    });
  }

  if (submitted) {
    return (
      <div className="waitlist-success">
        <div className="tick">✓</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 24, textTransform: 'uppercase', marginBottom: 8 }}>
          {t('waitlist.success.title')}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-dim)', letterSpacing: '1.4px' }}>
          {t('waitlist.success.body')}{Math.floor(80 + Math.random() * 40)}
        </div>
      </div>
    );
  }

  const showError = (field) => Boolean(touched[field] && errors[field]);

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate>
      <div className={'waitlist-field' + (showError('email') ? ' is-invalid' : '')}>
        <label htmlFor="wl-email">{t('waitlist.form.email')}</label>
        <input
          id="wl-email"
          type="email"
          value={data.email}
          onChange={(e) => setField('email', e.target.value)}
          onBlur={() => markTouched('email')}
          placeholder={t('waitlist.form.emailPlaceholder')}
          aria-invalid={showError('email')}
          aria-describedby={showError('email') ? 'wl-email-error' : undefined}
          autoComplete="email"
        />
        {showError('email') && (
          <div id="wl-email-error" className="waitlist-error" role="alert">
            {t(`waitlist.errors.${errors.email}`)}
          </div>
        )}
      </div>

      <div className="waitlist-field">
        <label htmlFor="wl-fleet">{t('waitlist.form.fleet')}</label>
        <select id="wl-fleet" value={data.fleet} onChange={(e) => setField('fleet', e.target.value)}>
          <option>1-10</option>
          <option>10-50</option>
          <option>50-200</option>
          <option>200+</option>
        </select>
      </div>

      <div className={'waitlist-field' + (showError('whatsapp') ? ' is-invalid' : '')}>
        <label htmlFor="wl-whatsapp">{t('waitlist.form.whatsapp')}</label>
        <input
          id="wl-whatsapp"
          type="tel"
          value={data.whatsapp}
          onChange={(e) => setField('whatsapp', e.target.value)}
          onBlur={() => markTouched('whatsapp')}
          placeholder={t('waitlist.form.whatsappPlaceholder')}
          aria-invalid={showError('whatsapp')}
          aria-describedby={showError('whatsapp') ? 'wl-whatsapp-error' : undefined}
          autoComplete="tel"
          inputMode="tel"
        />
        {showError('whatsapp') && (
          <div id="wl-whatsapp-error" className="waitlist-error" role="alert">
            {t(`waitlist.errors.${errors.whatsapp}`)}
          </div>
        )}
      </div>

      {submitError && (
        <div className="waitlist-error waitlist-error-block" role="alert">{submitError}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
        style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
      >
        {submitting ? t('waitlist.form.submitting') : t('waitlist.form.submit')} <span className="arrow">→</span>
      </button>
      <div className="waitlist-privacy">{t('waitlist.form.privacy')}</div>
    </form>
  );
}
