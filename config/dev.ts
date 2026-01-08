import type { UserConfigExport } from "@tarojs/cli";
import path from 'path';
import fs from 'fs';

// 证书文件路径
const keyPath = path.resolve(__dirname, '../certs/server.key');
const certPath = path.resolve(__dirname, '../certs/server.crt');

// 检查证书文件是否存在
const certExists = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default {
  mini: {},
  h5: {
    devServer: {
      // host: 'superapp.dchbi.app',
      host: '127.0.0.1',
      port: 5173,
      // 只有在证书文件存在时才配置 HTTPS
      ...(certExists && {
        https: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        }
      }),
      open: true
    }
  }
} satisfies UserConfigExport<'vite'>
