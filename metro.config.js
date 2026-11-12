const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Đảm bảo .wasm được Metro xử lý dưới dạng asset (cho expo-sqlite web)
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// Cấu hình headers bảo mật cho SharedArrayBuffer hỗ trợ SQLite WASM trên Web
// và phục vụ worker bundle khi expo-sqlite gọi new Worker(new URL('./worker', window.location.href))
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    const cleanUrl = (req.url || '').split('?')[0];
    if (cleanUrl === '/worker' || cleanUrl.endsWith('/worker')) {
      req.url = '/node_modules/expo-sqlite/web/worker.bundle?platform=web&dev=true';
    }

    middleware(req, res, next);
  };
};

module.exports = config;
