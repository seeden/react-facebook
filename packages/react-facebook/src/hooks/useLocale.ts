import { useState } from 'react';
import useFacebook from './useFacebook';

/**
 * Facebook locale string in the format `language_REGION` (e.g. `en_US`, `fr_FR`, `de_DE`).
 *
 * Facebook supports 100+ locales. Common values:
 * `en_US`, `en_GB`, `es_ES`, `es_LA`, `fr_FR`, `fr_CA`, `de_DE`, `it_IT`,
 * `pt_BR`, `pt_PT`, `ja_JP`, `ko_KR`, `zh_CN`, `zh_TW`, `zh_HK`, `ar_AR`,
 * `hi_IN`, `ru_RU`, `tr_TR`, `pl_PL`, `nl_NL`, `sv_SE`, `da_DK`, `nb_NO`,
 * `fi_FI`, `el_GR`, `cs_CZ`, `ro_RO`, `hu_HU`, `uk_UA`, `th_TH`, `vi_VN`,
 * `id_ID`, `ms_MY`, `tl_PH`, `he_IL`, `fa_IR`, `sr_RS`, `hr_HR`, `bg_BG`,
 * `sk_SK`, `sl_SI`, `ca_ES`, `eu_ES`, `gl_ES`
 *
 * Full list: https://www.facebook.com/translations/FacebookLocales.xml
 */
export type FacebookLocale = string;

/**
 * Hook for managing Facebook SDK locale dynamically
 *
 * @returns Object with current locale, setLocale function, and loading state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locale, setLocale, isChangingLocale } = useLocale();
 *
 *   return (
 *     <div>
 *       <p>Current locale: {locale}</p>
 *       <button
 *         onClick={() => setLocale('es_ES')}
 *         disabled={isChangingLocale}
 *       >
 *         Switch to Spanish
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export default function useLocale() {
  const { locale, setLocale: setFacebookLocale, loading } = useFacebook();
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  const setLocale = async (newLocale: FacebookLocale) => {
    if (newLocale === locale) {
      return;
    }

    try {
      setIsChangingLocale(true);
      await setFacebookLocale(newLocale);
    } finally {
      setIsChangingLocale(false);
    }
  };

  return {
    locale,
    setLocale,
    isChangingLocale: isChangingLocale || loading,
  };
}
