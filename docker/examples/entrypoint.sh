#!/bin/sh

set -e

echo "Running nginx"
echo "========================"
echo "LISTEN_PORT=>>${LISTEN_PORT}<<"
echo "APIHOST=${APIHOST}"
echo "APISCHEME=${APISCHEME}"
echo "APPLICATIONKEY=${DEV_APPLICATIONKEY}"
echo "HMACKEY=${DEV_HMACKEY}"


sed -i -e "s/\(listen\s\+\)\(80;\)/\1${LISTEN_PORT};/g"  /etc/nginx/conf.d/default.conf
cat /etc/nginx/conf.d/default.conf

for filename in /usr/share/nginx/html/examples/**/*.*; do
    sed -i "s/scheme: 'https'/scheme: '${APISCHEME}'/g" "${filename}"

    sed -i "s/webdemoapi.myscript.com/${APIHOST}/g" "${filename}"
    sed -i "s/newcloud.myscript.com/${APIHOST}/g" "${filename}"

    sed -i "s/515131ab-35fa-411c-bb4d-3917e00faf60/${DEV_APPLICATIONKEY}/g" "${filename}"
    sed -i "s/54b2ca8a-6752-469d-87dd-553bb450e9ad/${DEV_HMACKEY}/g" "${filename}"

    sed -i "s/7d223f9e-a3cb-4213-ba4b-85e930605f8b/${DEV_APPLICATIONKEY}/g" "${filename}"
    sed -i "s/5ab1935e-529a-4d48-a695-158450e52b13/${DEV_HMACKEY}/g" "${filename}"
done

nginx
