/**
 * Bypass Paywalls
 *
 * @file version.ts
 * @description Version number for the extension.
 */

import { extensionApi } from 'shared/common';

export function setVersion() {
  const manifestData = extensionApi !== undefined
    ? extensionApi.runtime.getManifest()
    : {
      version: '0.0.0'
    };
  const versionString = 'v' + manifestData.version;
  const versionElement = document.getElementById('version');
  if (versionElement !== null) {
    versionElement.innerText = versionString;
  }
}
