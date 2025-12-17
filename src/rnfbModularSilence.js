// Silence React Native Firebase modular deprecation warnings.
// Must be imported BEFORE any @react-native-firebase/* modules are imported.
// See: https://rnfirebase.io/migrating-to-v22
if (typeof globalThis !== 'undefined') {
  globalThis.RNFB_SILENCE_MODULAR_DEPRECATION = true;
} else if (typeof global !== 'undefined') {
  global.RNFB_SILENCE_MODULAR_DEPRECATION = true;
}
