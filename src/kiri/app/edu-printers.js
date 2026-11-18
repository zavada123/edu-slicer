/** EduProstir: the printers students pick from. No browser APIs here, so tests import it in Node. */

/** Printers in the list: the ones schools have most often. A teacher's own copies ("My ...") stay visible too. */
export const SCHOOL_PRINTERS = [
    'Creality.Ender.3',
    'Creality.K1',
    'Prusa.i3.MK3S+',
    'Prusa.mini',
    'Bambu.A1',
    'Bambu.P1S',
    'Anycubic.Kobra.2',
    'Flashforge.Adventurer.5M',
    'Any.Generic.Marlin',
];

/** The printer a new student starts with. */
export const DEFAULT_PRINTER = 'Creality.Ender.3';

/**
 * True when the printer list shows the device.
 * @param {string} name - device name as in src/kiri/dev/fdm (without .json) or a local copy
 * @returns {boolean}
 */
export function isSchoolPrinter(name) {
    return SCHOOL_PRINTERS.includes(name) || name.startsWith("My ");
}
