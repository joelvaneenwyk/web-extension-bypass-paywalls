#!/usr/bin/env bash

set -eux

BRANCH_ROOT="$(cd "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" &>/dev/null && cd ../ && pwd)"
SOURCE_ROOT="${BRANCH_ROOT}/src"

OUTPUT_DIR="${BRANCH_ROOT}/build/output"
TEMP_DIR="${BRANCH_ROOT}/.build"
mkdir -p "${OUTPUT_DIR}" "${TEMP_DIR}"

DOC_FILES="${BRANCH_ROOT}/README.md"
IMG_FILES="${SOURCE_ROOT}/icons/bypass.png"

# Strip subdirectories for Chrome manifest
sed 's/src\/.*\///g' "${BRANCH_ROOT}/manifest.json" >"${TEMP_DIR}/temp-chrome-manifest.json"

# Strip subdirectories for Firefox manifest
sed 's/src\/.*\///g' "${BRANCH_ROOT}/manifest-ff.json" >"${TEMP_DIR}/temp-ff-manifest.json"

# Fix update url for Chrome manifest
sed -i 's/updates\.xml/src\/updates\/updates.xml/g' "${TEMP_DIR}/temp-chrome-manifest.json"

# Fix update url for Firefox manifest
sed -i 's/updates\.json/src\/updates\/updates.json/g' "${TEMP_DIR}/temp-ff-manifest.json"

# Strip subdirectories for background.js
sed 's/src\/.*\///g' "${SOURCE_ROOT}/js/background.js" >"${TEMP_DIR}/temp-background.js"

# Strip subdirectories for options html file
sed 's/\.\.\/js\///g' "${SOURCE_ROOT}/html/options.html" >"${TEMP_DIR}/temp-options.html"

# Strip subdirectories for popup html file
sed 's/\.\.\/js\///g' "${SOURCE_ROOT}/html/popup.html" >"${TEMP_DIR}/temp-popup.html"

HTML_FILES="${TEMP_DIR}/temp-options.html ${TEMP_DIR}/temp-popup.html"
JS_FILES="${SOURCE_ROOT}/js/common.js ${SOURCE_ROOT}/js/sites.js ${SOURCE_ROOT}/js/contentScript.js ${SOURCE_ROOT}/js/options.js ${SOURCE_ROOT}/js/version.js ${TEMP_DIR}/temp-background.js"
GEN_FILES="$JS_FILES $HTML_FILES $DOC_FILES $IMG_FILES"
CH_FILES="$GEN_FILES ${TEMP_DIR}/temp-chrome-manifest.json ${SOURCE_ROOT}/updates/updates.xml"
FF_FILES="$GEN_FILES ${TEMP_DIR}/temp-ff-manifest.json ${SOURCE_ROOT}/updates/updates.json ${SOURCE_ROOT}/icons/bypass-dark.png"

NAME="output/bypass-paywalls"

# Remove existing files
rm -f $NAME.crx $NAME.xpi

if ! 7z -h >/dev/null; then
    sudo apt-get update
    sudo apt-get install p7zip-full p7zip-rar
fi

REQUIRED_FILES=manifest.json "${TEMP_DIR}/temp-background.js" background.js "${TEMP_DIR}/temp-options.html" options.html "${TEMP_DIR}/temp-popup.html" popup.html

# Generate Chrome .crx extension package
7z a -tzip -mx9 $NAME.crx "$CH_FILES"
7z rn $NAME.crx "${TEMP_DIR}/temp-chrome-manifest.json" $REQUIRED_FILES

# Generate Firefox .xpi extension package (firefox manifest)
7z a -tzip -mx9 $NAME.xpi "$FF_FILES"
7z rn $NAME.xpi "${TEMP_DIR}/temp-ff-manifest.json" $REQUIRED_FILES
# Remove temp files
printf "\nDeleting temp files...\n"
rm -v "${TEMP_DIR}/temp-chrome-manifest.json" "${TEMP_DIR}/temp-ff-manifest.json" "${TEMP_DIR}/temp-background.js" "${TEMP_DIR}/temp-options.html" "${TEMP_DIR}/temp-popup.html"
