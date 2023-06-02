import { parseIngredient as parse } from 'parse-ingredient';

const additionalUOMs = {
    Tüte: { short: 'Tüte', plural: 'Tüten', alternates: [] },
    Paket: { short: 'Paket', plural: 'boxes', alternates: [] },
    Dose: { short: 'Dose', plural: 'Dosen', alternates: [] },
    Karton: { short: 'Karton', plural: 'Kartons', alternates: [] },
    Zentimeter: { short: 'cm', plural: 'Zentimeter', alternates: ['cm'] },
    Knolle: { short: 'Knolle', plural: 'Knollen', alternates: [] },
    Tasse: { short: 'Tasse', plural: 'Tassen', alternates: [] },
    Messerspitze: { short: 'Msp', plural: 'Messerspitzen', alternates: ['Msp.'] },
    Tropfen: { short: 'Tropfen', plural: 'Tropfen', alternates: [] },
    Gramm: { short: 'g', plural: 'Gramm', alternates: [] },
    Kopf: { short: 'Kopf', plural: 'Köpfe', alternates: [] },
    Kilogramm: { short: 'kg', plural: 'Kilogramm', alternates: [] },
    Liter: { short: 'l', plural: 'Liter', alternates: [] },
    Meter: { short: 'm', plural: 'Meter', alternates: [] },
    Milligramm: { short: 'mg', plural: 'Milligramm', alternates: [] },
    Milliliter: { short: 'ml', plural: 'Milliliter', alternates: ['mL'] },
    Millimeter: { short: 'mm', plural: 'Millimeter', alternates: [] },
    Packung: { short: 'Packung', plural: 'Packungen', alternates: [] },
    Stück: { short: 'Stück', plural: 'Stücke', alternates: ['Stk', 'Stk.'] },
    Pfund: { short: 'Pfund', plural: 'Pfund', alternates: [] },
    Zweig: { short: 'Zweig', plural: 'Zweige', alternates: [] },
    Esslöffel: { short: 'EL', plural: 'Esslöffel', alternates: ['EL.'] },
    Teelöffel: { short: 'TL', plural: 'Teelöffel', alternates: ['TL.'] }
};

export const parseIngredient = (ingredientString: string) => {
    return parse(ingredientString.trim(), { additionalUOMs: additionalUOMs })
};