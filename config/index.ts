import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
import NutUIResolver from '@nutui/auto-import-resolver'
import path from 'path'

import Components from 'unplugin-vue-components/vite'
// import { VitePWA } from 'vite-plugin-pwa' // 暂时禁用 PWA

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'weaver',
    date: '2025-12-15',
    designWidth (input:any) {
      // 配置 NutUI 375 尺寸
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'vue3',
    compiler: {
      type: 'vite',
      vitePlugins: [
        Components({
          resolvers: [NutUIResolver({taro: true})]
        }),
        // 暂时禁用 PWA
        // VitePWA({
        //   registerType: 'autoUpdate',
        //   manifest: {
        //     name: 'DCH ePortal',
        //     short_name: 'ePortal',
        //     description: 'DCH New ePortal Experience',
        //     theme_color: '#8b2332',
        //     background_color: '#ffffff',
        //     display: 'standalone'
        //   },
        //   workbox: {
        //     globPatterns: ['**/*.{js,css,html}'],
        //     globIgnores: ['**/node_modules/**/*'],
        //     navigateFallback: null,
        //     runtimeCaching: [
        //       {
        //         urlPattern: /\/manifest\.webmanifest$/,
        //         handler: 'StaleWhileRevalidate',
        //         options: {
        //           cacheName: 'manifest-cache'
        //         }
        //       },
        //       {
        //         urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
        //         handler: 'CacheFirst',
        //         options: {
        //           cacheName: 'images-cache',
        //           expiration: {
        //             maxEntries: 50,
        //             maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        //           }
        //         }
        //       },
        //       {
        //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        //         handler: 'CacheFirst',
        //         options: {
        //           cacheName: 'google-fonts-cache',
        //           expiration: {
        //             maxEntries: 10,
        //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        //           },
        //           cacheableResponse: {
        //             statuses: [0, 200]
        //           }
        //         }
        //       },
        //       {
        //         urlPattern: /^https:\/\/api\.*/i,
        //         handler: 'NetworkFirst',
        //         options: {
        //           cacheName: 'api-cache',
        //           expiration: {
        //             maxEntries: 50,
        //             maxAgeSeconds: 60 * 5 // 5 minutes
        //           },
        //           cacheableResponse: {
        //             statuses: [0, 200]
        //           }
        //         }
        //       }
        //     ]
        //   },
        //   devOptions: {
        //     enabled: true
        //   }
        // })
      ]
    },
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
