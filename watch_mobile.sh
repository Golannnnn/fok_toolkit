#!/bin/bash

# this only works for android that has firefox nightly installed, make sure you have 'remote debugging via USB' enabled in the settings of the mobile browser and open the browser before running this script

# to run this for the first time, run `chmod +x watch_mobile.sh` in terminal from the root of the project

# Step 1: Check adb devices
devices=$(adb devices | grep -v "List of devices" | awk '{print $1}')

# Step 2: Check if any device is connected
if [ -z "$devices" ]; then
  echo "No device connected. Exiting."
  exit 1
fi

# Step 3: Change directory to 'dist'
cd dist || exit 1

# Step 4: Run the command with the selected device from adb
for device in $devices; do
  echo "Running web-ext for device: $device"
  web-ext run -t firefox-android --adb-device "$device" --firefox-apk org.mozilla.fenix
done
