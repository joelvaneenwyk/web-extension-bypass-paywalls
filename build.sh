#!/usr/bin/env bash

set -eEau pipefail

function _7z() {
  if command -v 7z >/dev/null; then
    7z "$@" | tr -s '\n'
  else
    _path=~/scoop/shims/7z.exe
    if [ -f "$_path" ]; then
      "$_path" "$@"
    fi
  fi
}

function rename_file() {
  local archive_dir
  archive_dir="$(dirname -- "${1:-}")"

  local archive_filename
  archive_filename="$(basename -- "${1:-}")"

  local filename
  filename="$(basename -- "${2:-}")"

  local target="${filename/temp-/}"
  target="${target/ff-/}"
  if [[ "$filename" != "$target" ]]; then
    cd "${archive_dir}" || return 2
    _7z rn "$archive_filename" "${filename}" "${target}"
  fi

  return 0
}

function build() {
  BRANCH_ROOT="$(cd "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" &>/dev/null && pwd)"

  OUTPUT_DIR="${BRANCH_ROOT}/dist"
  TEMP_DIR="${BRANCH_ROOT}/.build"
  mkdir -p "${OUTPUT_DIR}" "${TEMP_DIR}"

  if ! command -v 7z >/dev/null; then
    if command -v sudo >/dev/null && command -v apt-get >/dev/null; then
      sudo apt-get update
      sudo apt-get install -y --no-install-recommends p7zip-full p7zip-rar
    fi
  fi

  if ! _7z -h >/dev/null 2>&1; then
    echo "7z is not installed. Please install it manually."
    return 1
  fi

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

  DOC_FILES="${BRANCH_ROOT}/README.md"
  IMG_FILES="${BRANCH_ROOT}/src/icons/bypass.png"
  HTML_FILES=(
    "${TEMP_DIR}/temp-options.html"
    "${TEMP_DIR}/temp-popup.html")
  JS_FILES=(
    "${BRANCH_ROOT}/dist/js/background.js"
    "${BRANCH_ROOT}/dist/js/contentScript.js"
    "${BRANCH_ROOT}/dist/js/options.js"
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

  NAME="${OUTPUT_DIR}/bypass-paywalls"

  # Generate Chrome .crx extension package
  rm -f "$NAME.crx"
  _7z a -tzip -bb1 -mx9 "$NAME.crx" "${CH_FILES[@]}"
  for value in "${CH_FILES[@]}"; do
    rename_file "$NAME.crx" "$value"
  done

  # Generate Firefox .xpi extension package
  rm -f "$NAME.xpi"
  _7z a -tzip -bb1 -mx9 "$NAME.xpi" "${FF_FILES[@]}"
  for value in "${FF_FILES[@]}"; do
    rename_file "$NAME.xpi" "$value"
  done

  # Remove temp files
  files=("${CH_FILES[@]}" "${FF_FILES[@]}")
  for value in "${files[@]}"; do
    if [[ $value == *"${TEMP_DIR}"* ]]; then
      rm -fv "$value"
    fi
  done
  printf "Removed temporary files...\n"
}

yarn install
yarn build
build "$@"
