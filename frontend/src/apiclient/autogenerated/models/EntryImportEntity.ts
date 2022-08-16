/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import {
  EntryImportEntries,
  EntryImportEntriesFromJSON,
  EntryImportEntriesFromJSONTyped,
  EntryImportEntriesToJSON,
} from "./EntryImportEntries";

/**
 *
 * @export
 * @interface EntryImportEntity
 */
export interface EntryImportEntity {
  /**
   *
   * @type {string}
   * @memberof EntryImportEntity
   */
  entity: string;
  /**
   *
   * @type {Array<EntryImportEntries>}
   * @memberof EntryImportEntity
   */
  entries: Array<EntryImportEntries>;
}

export function EntryImportEntityFromJSON(json: any): EntryImportEntity {
  return EntryImportEntityFromJSONTyped(json, false);
}

export function EntryImportEntityFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EntryImportEntity {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    entity: json["entity"],
    entries: (json["entries"] as Array<any>).map(EntryImportEntriesFromJSON),
  };
}

export function EntryImportEntityToJSON(value?: EntryImportEntity | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    entity: value.entity,
    entries: (value.entries as Array<any>).map(EntryImportEntriesToJSON),
  };
}
