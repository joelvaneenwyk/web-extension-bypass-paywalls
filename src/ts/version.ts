/**
 * Bypass Paywalls
 *
 * @file version.ts
 * @description Version number for the extension.
 */

if (extensionApi !== undefined) {
    const manifestData = extensionApi.runtime.getManifest();
    const versionString = 'v' + manifestData.version;
    const versionElement = document.getElementById('version');
    if (versionElement !== null) {
        versionElement.innerText = versionString;
    }
}
