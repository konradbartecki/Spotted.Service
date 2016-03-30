#!/bin/bash

# First, get the zip file
cd /home/antos/tmp && curl -H "Authorization: token b6d2fa9779de7d89fc8ee57e355e7578f00a19a1" \
-L https://api.github.com/repos/konradbartecki/Spotted.Service/tarball > master.tar.gz

# Second, unzip it, if the zip file exists
if [ -f /home/antos/tmp/master.tar.gz ]; then
    tar xpvf /home/antos/tmp/master.tar.gz
    rm -rf /home/antos/www
    mv /home/antos/tmp/konradbartecki-Spotted.Service* /home/antos/www
    rm -rf /home/antos/tmp
    mkdir /home/antos/tmp
    cd /home/antos/www
    # npm install
    nodejs /home/antos/www/server.js
    # Delete current directory
    # Unzip the zip file
    # Perhaps call any other scripts you need to rebuild assets here
    # or set owner/permissions
    # or confirm that the old site was replaced correctly
fi
