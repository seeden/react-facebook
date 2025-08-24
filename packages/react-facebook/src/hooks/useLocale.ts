import { useState } from 'react';
import useFacebook from './useFacebook';

export type FacebookLocale = 
  | 'en_US' // English (US)
  | 'es_ES' // Spanish (Spain)
  | 'es_LA' // Spanish (Latin America)
  | 'fr_FR' // French (France)
  | 'de_DE' // German (Germany)
  | 'it_IT' // Italian (Italy)
  | 'pt_BR' // Portuguese (Brazil)
  | 'pt_PT' // Portuguese (Portugal)
  | 'ja_JP' // Japanese (Japan)
  | 'ko_KR' // Korean (South Korea)
  | 'zh_CN' // Chinese (Simplified)
  | 'zh_TW' // Chinese (Traditional)
  | 'ar_AR' // Arabic
  | 'hi_IN' // Hindi (India)
  | 'th_TH' // Thai (Thailand)
  | 'vi_VN' // Vietnamese (Vietnam)
  | 'ru_RU' // Russian (Russia)
  | 'tr_TR' // Turkish (Turkey)
  | 'pl_PL' // Polish (Poland)
  | 'nl_NL' // Dutch (Netherlands)
  | 'sv_SE' // Swedish (Sweden)
  | 'da_DK' // Danish (Denmark)
  | 'no_NO' // Norwegian (Norway)
  | 'fi_FI' // Finnish (Finland)
  | 'cs_CZ' // Czech (Czech Republic)
  | 'hu_HU' // Hungarian (Hungary)
  | 'ro_RO' // Romanian (Romania)
  | 'bg_BG' // Bulgarian (Bulgaria)
  | 'hr_HR' // Croatian (Croatia)
  | 'sk_SK' // Slovak (Slovakia)
  | 'sl_SI' // Slovenian (Slovenia)
  | 'et_EE' // Estonian (Estonia)
  | 'lv_LV' // Latvian (Latvia)
  | 'lt_LT' // Lithuanian (Lithuania)
  | 'uk_UA' // Ukrainian (Ukraine)
  | 'he_IL' // Hebrew (Israel)
  | 'af_ZA' // Afrikaans (South Africa)
  | 'ms_MY' // Malay (Malaysia)
  | 'id_ID' // Indonesian (Indonesia)
  | 'tl_PH' // Filipino (Philippines)
  | 'cy_GB' // Welsh (United Kingdom)
  | 'eu_ES' // Basque (Spain)
  | 'ca_ES' // Catalan (Spain)
  | 'gl_ES'; // Galician (Spain)

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
 *       {isChangingLocale && <p>Changing locale...</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export default function useLocale() {
  const { locale, setLocale: setFacebookLocale, isLoading } = useFacebook();
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  const setLocale = async (newLocale: FacebookLocale) => {
    if (newLocale === locale) {
      return; // No change needed
    }

    try {
      setIsChangingLocale(true);
      await setFacebookLocale(newLocale);
    } finally {
      setIsChangingLocale(false);
    }
  };

  return {
    locale: locale as FacebookLocale,
    setLocale,
    isChangingLocale: isChangingLocale || isLoading,
    availableLocales: [
      'en_US', 'es_ES', 'es_LA', 'fr_FR', 'de_DE', 'it_IT', 'pt_BR', 'pt_PT',
      'ja_JP', 'ko_KR', 'zh_CN', 'zh_TW', 'ar_AR', 'hi_IN', 'th_TH', 'vi_VN',
      'ru_RU', 'tr_TR', 'pl_PL', 'nl_NL', 'sv_SE', 'da_DK', 'no_NO', 'fi_FI',
      'cs_CZ', 'hu_HU', 'ro_RO', 'bg_BG', 'hr_HR', 'sk_SK', 'sl_SI', 'et_EE',
      'lv_LV', 'lt_LT', 'uk_UA', 'he_IL', 'af_ZA', 'ms_MY', 'id_ID', 'tl_PH',
      'cy_GB', 'eu_ES', 'ca_ES', 'gl_ES'
    ] as FacebookLocale[],
  };
}