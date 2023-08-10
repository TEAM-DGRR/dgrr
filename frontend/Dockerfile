FROM nginx:latest
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*
COPY /build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]