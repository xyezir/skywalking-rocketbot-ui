FROM registry.cn-shanghai.aliyuncs.com/xfp/openresty:1.15.8.2-5-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    bash \
    gettext

RUN mkdir -p /var/static
WORKDIR /var/static

COPY dist/ ./dist
COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY conf/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

WORKDIR /var/static/dist
COPY entrypoint.sh ./

ENTRYPOINT ["./entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
