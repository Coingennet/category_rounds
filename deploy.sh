export NODE_ENV=staging && yarn build
cd dist/
git init 
git add -A
git commit -m "deploy"
git push -f https://github.com/a-dung-97/crypto-dashboard3.git master:gh-pages
cd ../
rm -rf dist