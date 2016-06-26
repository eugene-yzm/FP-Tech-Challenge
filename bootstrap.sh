#!/usr/bin/env bash
echo "Starting provisioning"
sudo apt-get -y update;
sudo apt-get -y install git;
sudo apt-get -y install curl;
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -;
sudo apt-get install -y nodejs;
npm install --no-bin-links;

