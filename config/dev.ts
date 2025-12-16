import type { UserConfigExport } from "@tarojs/cli";
import path from 'path';
import fs from 'fs';


export default {

  mini: {},
   h5: {
    devServer: {
      host: 'superapp.dchbi.app',
      port: 5173,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../certs/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../certs/server.crt'))
      },
      open: true
    }
  }
} satisfies UserConfigExport<'vite'>
