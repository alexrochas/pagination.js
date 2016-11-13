FROM php:7.0-cli

COPY . /usr/src/pagination.js

WORKDIR /usr/src/pagination.js

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000"]

