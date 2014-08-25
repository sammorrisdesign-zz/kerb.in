whatsonkerb
===========

A service that tells you what's on Kerb KX

## Requirements
* Ruby 1.9.2
* [Node](nodejs.org) with the latest version of Node Package Manager

## Usage

This project uses Node scrape the Kerb website, Handlebrs to output static html and Sass to output CSS. These tasks are automated using [Grunt](http://gruntjs.com/).

To get Grunt, run: `npm install -g grunt-cli`

You'll then need to run `npm install` from both the root folder and the `/api` folder to get the various dependances.

From then on use `grunt watch`, or simply just `grunt` to compile all then watch, from the root to automate all tasks during development.