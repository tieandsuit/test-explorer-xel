Welcome to XEL.

This is the XEL Peer Explorer reference implementation.

We currently do our front and backend development on Debian/Ubuntu desktops, we find it to be
an excellent open source free! and secure platform. While we try and help new developers coming
to XEL  as best as possible, it is unfortunately not possible to include detailed step by
step instructions for platforms that are not Debian based. In time it is our goal to include
detailed step by step instructions for all platforms.

Build Instructions XEL Peerexplorer v0.0.1
----------------------------------------

XEL Peerexplorer makes extensive use of nodejs. We use if for dependency managemnt,
to power our builds and to assist in development through auto-recompiling and to
power up your local development server. Complete installation instructions for nodejs
are out of the scope of this document since those instructions depend largely on the
platform you are on.

Windows and Mac users please look at anyone of these links:

https://www.google.com/search?q=how+to+install+nodejs (GIYF)
https://howtonode.org/how-to-install-nodejs

Debian/Ubuntu users please follow these steps

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

Requirements
------------
 1. You need to install nodejs. For windows download it from here: https://nodejs.org/en/download/
 2. After installing nodejs and setting path variables, install gulp as a global dependency.
    Follow the guide here: http://omcfarlane.co.uk/install-gulp-js-windows/


Build
-----

 First time install

 1. Type 'npm install'
 2. Type 'bower install'
 3. Type 'gulp build'

 Testing local changes

 1. Type 'gulp server'

 Testing distributed changes

 1. Type 'gulp server:dist'
