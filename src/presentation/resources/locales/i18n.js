import ReactNative from 'react-native'
import I18n from 'react-native-i18n'

import en from './en.json'
import uk from './uk.json'
import ru from './ru.json'

I18n.fallbacks = true

I18n.translations = {
  en,
  uk,
  ru
}

const currentLocale = I18n.currentLocale()

export const isRTL = false

ReactNative.I18nManager.allowRTL(isRTL)

export function strings(name, params = {}) {
  return I18n.t(name, params)
}

export default I18n
