/**
 * Bypass Paywalls
 */

import { extensionApi } from './shared/common';
import { defaultSites } from './shared/sites';
import { setVersion } from './shared/version';

// Shortcut for document.querySelector()
export function $<E extends Element = Element>(sel: string, el: ParentNode = document): E | null {
  return el.querySelector<E>(sel);
}

// Shortcut for document.querySelectorAll()
export function $$<E extends Element = Element>(sel: string, el: ParentNode = document): Array<E> {
  return Array.from(el.querySelectorAll<E>(sel));
}

// Select UI pane
export function selectPane<E extends Object & { target: any }>(e: E) {
  const panes = $$('.pane');
  for (const tab of $$('#tabs button')) {
    tab.classList.toggle('active', tab === e.target);
  }

  for (const pane of panes) {
    if (e.target instanceof HTMLElement) {
      pane.classList.toggle('active', pane.id === e.target?.dataset?.pane);
    }
  }
}

// Saves options to extensionApi.storage
export function saveOptions() {
  const sites = $$<HTMLInputElement>('#bypass_sites input').reduce(function (memo, inputEl) {
    if (inputEl.checked) {
      memo[inputEl.dataset.key] = inputEl.dataset.value;
    }
    return memo;
  }, {});

  const customSites = $<HTMLInputElement>('#custom_sites')
    .value.split('\n')
    .map((s) => s.trim())
    .filter((s) => s);

  extensionApi.storage.sync.set(
    {
      sites,
      customSites,
    },
    function () {
      // Update status to let user know options were saved.
      const status = $('#status');
      status.textContent = 'Options saved';
      setTimeout(function () {
        status.textContent = '';

        // Reload runtime so background script picks up changes
        extensionApi.runtime.reload();

        window.close();
      }, 800);
    }
  );
}

// Restores checkbox input states using the preferences
// stored in extensionApi.storage.
export function renderOptions() {
  extensionApi.storage.sync.get(
    {
      sites: {},
      customSites: [],
    },
    function (items) {
      // Render supported sites
      const sites = items.sites;
      for (const key in defaultSites) {
        if (!Object.prototype.hasOwnProperty.call(defaultSites, key)) {
          continue;
        }

        const value = defaultSites[key];
        const labelEl = document.createElement('label');
        const inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.dataset.key = key;
        inputEl.dataset.value = value;
        inputEl.checked = key in sites || key.replace(/\s\(.*\)/, '') in sites;

        labelEl.appendChild(inputEl);
        labelEl.appendChild(document.createTextNode(key));
        $('#bypass_sites').appendChild(labelEl);
      }

      // Render custom sites
      const customSites = items.customSites;
      $<HTMLInputElement>('#custom_sites').value = customSites.join('\n');

      // Set select all/none checkbox state.  Note: "indeterminate" checkboxes
      // require `chrome_style: false` be set in manifest.json.  See
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1097489
      const nItems = $$('input[data-key]').length;
      const nChecked = $$<HTMLInputElement>('input[data-key]').filter((el) => el.checked).length;
      $<HTMLInputElement>('#select-all input').checked = nChecked / nItems > 0.5;
      $<HTMLInputElement>('#select-all input').indeterminate = nChecked && nChecked !== nItems;
    }
  );
}

// Select/deselect all supported sites
export function selectAll() {
  for (const el of $$<HTMLInputElement>('input[data-key]')) {
    el.checked = this.checked;
  }
}

// Initialize UI
export function init() {
  setVersion();

  renderOptions();

  $('#save').addEventListener('click', saveOptions);
  $('#select-all input').addEventListener('click', selectAll);

  for (const el of $$('#tabs button')) {
    el.addEventListener('click', selectPane);
  }

  selectPane({ target: $('#tabs button:first-child') });

  if (extensionApi.isChrome) {
    document.body.classList.add('customSitesEnabled');
  }
}

document.addEventListener('DOMContentLoaded', init);
