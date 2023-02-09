webpack -c ./webpack.config_prod.js
zip -r build.zip dist
butler push build.zip erikrospo/cellrunner:web
rm build.zip