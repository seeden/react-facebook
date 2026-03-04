import React, { useState } from 'react';
import { FacebookProvider, useLocale, useFacebook, Share, Page } from 'react-facebook';

function LocaleTestComponent() {
  const { locale, setLocale, isChangingLocale } = useLocale();
  const { error: contextError } = useFacebook();
  const [changeAttempts, setChangeAttempts] = useState(0);
  const [lastRequestedLocale, setLastRequestedLocale] = useState('');

  const handleLocaleChange = async (newLocale: Parameters<typeof setLocale>[0]) => {
    setChangeAttempts((c) => c + 1);
    setLastRequestedLocale(newLocale);
    await setLocale(newLocale);
  };

  return (
    <div data-testid="locale-test">
      <div data-testid="current-locale">{locale}</div>
      <div data-testid="is-changing">{isChangingLocale ? 'true' : 'false'}</div>
      <div data-testid="change-attempts">{changeAttempts}</div>
      <div data-testid="last-requested-locale">{lastRequestedLocale || 'none'}</div>
      <div data-testid="context-error">{contextError ? contextError.message : 'no-error'}</div>
      <button data-testid="change-to-spanish" onClick={() => handleLocaleChange('es_ES')} disabled={isChangingLocale}>
        Change to Spanish
      </button>
      <button data-testid="change-to-french" onClick={() => handleLocaleChange('fr_FR')} disabled={isChangingLocale}>
        Change to French
      </button>
      <button data-testid="change-to-english" onClick={() => handleLocaleChange('en_US')} disabled={isChangingLocale}>
        Change to English
      </button>

      <Share href="https://example.com" layout="button" data-testid="test-share-widget" />
      <Page href="https://www.facebook.com/meta" width={300} height={200} data-testid="test-page-widget" />
    </div>
  );
}

function DirectContextTest() {
  const { locale, setLocale, error: contextError } = useFacebook();
  const [directAttempts, setDirectAttempts] = useState(0);

  const handleDirectChange = async () => {
    setDirectAttempts((c) => c + 1);
    await setLocale('de_DE');
  };

  return (
    <div data-testid="direct-context-test">
      <div data-testid="context-locale">{locale}</div>
      <div data-testid="direct-attempts">{directAttempts}</div>
      <div data-testid="direct-error">{contextError ? contextError.message : 'no-error'}</div>
      <button data-testid="direct-change-locale" onClick={handleDirectChange}>
        Change to German (Direct)
      </button>
    </div>
  );
}

export default function LocalePage() {
  return (
    <FacebookProvider appId="671184534658954">
      <div data-testid="locale-page">
        <LocaleTestComponent />
        <DirectContextTest />
      </div>
    </FacebookProvider>
  );
}
