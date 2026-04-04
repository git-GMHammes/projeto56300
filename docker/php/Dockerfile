FROM php:8.2-fpm

# Configurar proxy da rede DETRAN (usando IP pois a VM não resolve DNS interno)
ENV http_proxy=http://10.200.188.17:80
ENV https_proxy=http://10.200.188.17:80
ENV no_proxy=localhost,127.0.0.1

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev zip unzip vim \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mysqli mbstring exif pcntl bcmath gd zip intl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

USER www-data

CMD ["php-fpm"]