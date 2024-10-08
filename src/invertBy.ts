import type { Simplify } from "type-fest";
import { purry } from "./purry";
import { isArray } from "./isArray";

type InvertedBy<T extends object> = Simplify<{
  -readonly [K in keyof T as K extends number | string
    ? Required<T>[K] extends PropertyKey
      ? Required<T>[K]
      : never
    : never]: Array<`${K extends number | string ? K : never}`>;
}>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
export function invertBy<T extends object>(object: T): InvertedBy<T>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
export function invertBy<T extends object>(): (object: T) => InvertedBy<T>;

export function invertBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(invertByImplementation, args);
}

function invertByImplementation(
  data: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, Array<PropertyKey>> {
  const result: Record<PropertyKey, Array<PropertyKey>> = {};

  for (const [key, value] of Object.entries(data)) {
    const invertedValue = result[value];
    if (isArray(invertedValue)) {
      invertedValue.push(key);
    } else {
      result[value] = [key];
    }
  }

  return result;
}
