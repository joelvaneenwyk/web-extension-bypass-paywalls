#!/usr/bin/env bash

set -eux

BRANCH_ROOT="$(cd "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" &>/dev/null && cd ../ && pwd)"

OUTPUT_DIR="${BRANCH_ROOT}/dist"
TEMP_DIR="${BRANCH_ROOT}/.build"
mkdir -p "${OUTPUT_DIR}" "${TEMP_DIR}"

DOC_FILES="${BRANCH_ROOT}/README.md"
IMG_FILES="${BRANCH_ROOT}/src/icons/bypass.png"

# Strip subdirectories for Chrome manifest
sed 's/src\/.*\///g' "${BRANCH_ROOT}/manifest.json" >"${TEMP_DIR}/temp-chrome-manifest.json"

# Fix update url for Chrome manifest
sed -i 's/updates\.xml/src\/updates\/updates.xml/g' "${TEMP_DIR}/temp-chrome-manifest.json"

# Strip subdirectories for Firefox manifest
sed 's/src\/.*\///g' "${BRANCH_ROOT}/manifest-ff.json" >"${TEMP_DIR}/temp-ff-manifest.json"

# Fix update url for Firefox manifest
sed -i 's/updates\.json/src\/updates\/updates.json/g' "${TEMP_DIR}/temp-ff-manifest.json"

# Strip subdirectories for background.js
sed 's/src\/.*\///g' "${BRANCH_ROOT}/src/js/background.js" >"${TEMP_DIR}/temp-background.js"

# Strip subdirectories for options html file
sed 's/\.\.\/js\///g' "${BRANCH_ROOT}/src/html/options.html" >"${TEMP_DIR}/temp-options.html"

# Strip subdirectories for popup html file
sed 's/\.\.\/js\///g' "${BRANCH_ROOT}/src/html/popup.html" >"${TEMP_DIR}/temp-popup.html"

HTML_FILES=(
    "${TEMP_DIR}/temp-options.html"
    "${TEMP_DIR}/temp-popup.html")
JS_FILES=(
    "${BRANCH_ROOT}/src/js/common.js"
    "${BRANCH_ROOT}/src/js/sites.js"
    "${BRANCH_ROOT}/src/js/contentScript.js"
    "${BRANCH_ROOT}/src/js/options.js"
    "${BRANCH_ROOT}/src/js/version.js"
    "${TEMP_DIR}/temp-background.js")
GEN_FILES=(
    "${JS_FILES[@]}"
    "${HTML_FILES[@]}"
    "${DOC_FILES[@]}"
    "${IMG_FILES[@]}")
CH_FILES=(
    "${GEN_FILES[@]}"
    "${TEMP_DIR}/temp-chrome-manifest.json"
    "${BRANCH_ROOT}/src/updates/updates.xml")
FF_FILES=(
    "${GEN_FILES[@]}"
    "${TEMP_DIR}/temp-ff-manifest.json"
    "${BRANCH_ROOT}/src/updates/updates.json"
    "${BRANCH_ROOT}/src/icons/bypass-dark.png")

if ! 7z -h >/dev/null; then
    sudo apt-get update
    sudo apt-get install p7zip-full p7zip-rar
fi

NAME="${OUTPUT_DIR}/bypass-paywalls"

# Remove existing output files
rm -f "$NAME.crx" "$NAME.xpi"

# Generate Chrome .crx extension package
7z a -tzip -mx9 "$NAME.crx" "${CH_FILES[@]}" | tr -s '\n'
7z rn "$NAME.crx" \
    "${TEMP_DIR}/temp-chrome-manifest.json" "${BRANCH_ROOT}/manifest.json" \
    "${TEMP_DIR}/temp-background.js" "${BRANCH_ROOT}/background.js" \
    "${TEMP_DIR}/temp-options.html" "${BRANCH_ROOT}/options.html" \
    "${TEMP_DIR}/temp-popup.html" "${BRANCH_ROOT}/popup.html" | tr -s '\n'

# Generate Firefox .xpi extension package (firefox manifest)
7z a -tzip -mx9 "$NAME.xpi" "${FF_FILES[@]}" | tr -s '\n'
7z rn "$NAME.xpi" \
    "${TEMP_DIR}/temp-ff-manifest.json" "${BRANCH_ROOT}/manifest.json" \
    "${TEMP_DIR}/temp-background.js" "${BRANCH_ROOT}/background.js" \
    "${TEMP_DIR}/temp-options.html" "${BRANCH_ROOT}/options.html" \
    "${TEMP_DIR}/temp-popup.html" "${BRANCH_ROOT}/popup.html" | tr -s '\n'

# Remove temp files
rm -v \
    "${TEMP_DIR}/temp-chrome-manifest.json" \
    "${TEMP_DIR}/temp-ff-manifest.json" \
    "${TEMP_DIR}/temp-background.js" \
    "${TEMP_DIR}/temp-options.html" \
    "${TEMP_DIR}/temp-popup.html"
printf "Removed temporary files...\n"
