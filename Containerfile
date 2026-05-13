FROM docker.io/nginx

COPY ./container/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./container/nginx/default.conf /etc/nginx/conf.d/default.conf

ADD dist /static
