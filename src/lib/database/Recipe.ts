// created via https://app.quicktype.io/?l=ts

import type { FieldValue } from "firebase/firestore";
import type { Ingredient } from "parse-ingredient";

// To parse this data:
//
//   import { Convert, Recipe } from "./file";
//
//   const recipe = Convert.toRecipe(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface RecipePreview {
    images: (string | File)[];
    ingredients: Ingredient[];
    name: string;
    instructions: string[];
    sourceUrl: string | null;
    prepTime: number | null;
    cookTime: number | null;
    restingTime: number | null;
    totalTime: number | null;
    recipeYield: number | null;
    keywords: string[];
    comment: string | null;
}

export const getEmptyRecipePreview = (): RecipePreview => {
    return {
        images: [],
        ingredients: [],
        name: '',
        instructions: [],
        sourceUrl: null,
        prepTime: null,
        cookTime: null,
        restingTime: null,
        totalTime: null,
        recipeYield: null,
        keywords: [],
        comment: null
    };
}

export interface Recipe extends RecipePreview {
    id: string;
    addedBy: string;
    addedTimestamp: FieldValue;

}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRecipe(json: string): Recipe {
        return cast(JSON.parse(json), r("Recipe"));
    }

    public static toRecipePreview(json: string): RecipePreview {
        return cast(JSON.parse(json), r("RecipePreview"));
    }

    public static recipeToJson(value: Recipe): string {
        return JSON.stringify(uncast(value, r("Recipe")), null, 2);
    }

    public static recipePreviewToJson(value: RecipePreview): string {
        return JSON.stringify(uncast(value, r("RecipePreview")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Recipe": o([
        { json: "id", js: "id", typ: "" },
        { json: "images", js: "images", typ: a(u("", r("File"))) },
        { json: "ingredients", js: "ingredients", typ: a(r("Ingredient")) },
        { json: "name", js: "name", typ: "" },
        { json: "instructions", js: "instructions", typ: "" },
        { json: "addedBy", js: "addedBy", typ: "" },
        { json: "addedTimestamp", js: "addedTimestamp", typ: "" },
        { json: "sourceUrl", js: "sourceUrl", typ: "" },
        { json: "prepTime", js: "prepTime", typ: 0 },
        { json: "cookTime", js: "cookTime", typ: 0 },
        { json: "restingTime", js: "restingTime", typ: 0 },
        { json: "totalTime", js: "totalTime", typ: 0 },
        { json: "recipeYield", js: "recipeYield", typ: 0 },
        { json: "keywords", js: "keywords", typ: a("") },
        { json: "comment", js: "comment", typ: "" },
    ], false),
};
