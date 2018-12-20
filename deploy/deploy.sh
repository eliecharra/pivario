#!/bin/bash

##
## Create the SSH directory and give it the right permissions
##
mkdir -p ~/.ssh
chmod 700 ~/.ssh

eval $(ssh-agent -s)
ssh-add deploy/deploy_key

git checkout master
git remote add balena gh_eliecharra@git.balena-cloud.com:gh_eliecharra/pivario0.git
git push balena
