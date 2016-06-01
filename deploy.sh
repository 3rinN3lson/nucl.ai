grunt clean; git checkout gh-pages; git pull -u; git merge -X theirs master; grunt build; git commit -a -m "Deployed assets."; git push origin gh-pages --force; git checkout master
