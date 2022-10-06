cd /Users/ssandralee/Desktop/dev/site-note-deploy
rm -rf `ls`
cd /Users/ssandralee/Desktop/dev/website-note/docs/.vuepress
mv -f dist/* /Users/ssandralee/Desktop/dev/site-note-deploy
cd /Users/ssandralee/Desktop/dev/site-note-deploy
git add -A
git commit -m "auto deploy"
git push
ssh root@sakurajimama1.ltd "cd ..;cd usr/local/nginx/html/site-note-deploy; git pull"