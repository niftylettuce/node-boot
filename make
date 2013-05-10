
# build the API docs

# first you need to:
# `$ sudo npm install -g readme-docs`
# (make sure you're using v0.0.9 or greater by checking with:
# `$ readme-docs --version`

# now we build to the /build folder

readme-docs -t 'node-boot' -g https://github.com/cbumgard/node-boot

# now copy the build folder, paste elsewhere for now, checkout gh-pages, and move in the build
mkdir -p ~/tmp/build/
mv build/* ~/tmp/build/
git fetch origin gh-pages
git checkout gh-pages
cp -R ~/tmp/build/* .
rm -rf ~/tmp/build
git add .
git commit -m 'updated api docs'
git push origin gh-pages
git checkout master
