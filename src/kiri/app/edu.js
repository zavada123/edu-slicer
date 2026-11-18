/** EduProstir: a 3D-printing slicer for school (fork of Kiri:Moto, MIT). */

import { api } from './api.js';
import { DEFAULT_PRINTER, isSchoolPrinter } from './edu-printers.js';

/** Name shown in the menu bar and the tab title. */
export const BRAND_NAME = '3D-друк';

/** Browser storage key: set once the default printer was chosen, so a later choice of the student stays. */
const PRINTER_CHOSEN_KEY = 'edu-printer-chosen';

/** Set before the app starts: features read during init. */
export function setupFeatures() {
    api.feature.device_filter = isSchoolPrinter;
    // The upstream help dialog (forums, donations) opens on first visit and after updates: not for students.
    api.help.show = () => {};
}

/** After init: FDM only, a school printer selected, our name in the menu bar. */
export function applyDefaults() {
    if (!api.mode.is_fdm()) {
        api.mode.set('FDM');
    }
    if (!isSchoolPrinter(api.device.get()) || !readFlag(PRINTER_CHOSEN_KEY)) {
        api.device.set(DEFAULT_PRINTER);
        // the selector in the left panel shows the device it was built with: rebuild it
        api.devices.refresh();
        writeFlag(PRINTER_CHOSEN_KEY);
    }
    const appname = document.querySelector('.menubar-appname');
    if (appname) appname.textContent = BRAND_NAME;
    document.title = BRAND_NAME;
}

/** localStorage can be off (private window, blocked site data): the slicer still works, only the choice is not kept. */
function readFlag(key) {
    try { return localStorage.getItem(key) === '1' } catch { return false }
}

function writeFlag(key) {
    try { localStorage.setItem(key, '1') } catch { /* not kept */ }
}
