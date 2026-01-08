# 第一阶段：构建应用
FROM node:20-slim AS builder

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建 H5 应用
RUN yarn build:h5

# 第二阶段：使用 nginx 提供服务
FROM nginx:alpine

# 从构建阶段复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
