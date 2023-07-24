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
import type { AdvancedSearchResultAttrInfo } from "./AdvancedSearchResultAttrInfo";
import {
  AdvancedSearchResultAttrInfoFromJSON,
  AdvancedSearchResultAttrInfoFromJSONTyped,
  AdvancedSearchResultAttrInfoToJSON,
} from "./AdvancedSearchResultAttrInfo";

/**
 *
 * @export
 * @interface AdvancedSearchResultExport
 */
export interface AdvancedSearchResultExport {
  /**
   *
   * @type {Array<number>}
   * @memberof AdvancedSearchResultExport
   */
  entities: Array<number>;
  /**
   *
   * @type {Array<AdvancedSearchResultAttrInfo>}
   * @memberof AdvancedSearchResultExport
   */
  attrinfo: Array<AdvancedSearchResultAttrInfo>;
  /**
   *
   * @type {boolean}
   * @memberof AdvancedSearchResultExport
   */
  hasReferral?: boolean;
  /**
   *
   * @type {string}
   * @memberof AdvancedSearchResultExport
   */
  referralName?: string;
  /**
   *
   * @type {string}
   * @memberof AdvancedSearchResultExport
   */
  entryName?: string;
  /**
   *
   * @type {boolean}
   * @memberof AdvancedSearchResultExport
   */
  isAllEntities?: boolean;
  /**
   *
   * @type {string}
   * @memberof AdvancedSearchResultExport
   */
  exportStyle: string;
}

/**
 * Check if a given object implements the AdvancedSearchResultExport interface.
 */
export function instanceOfAdvancedSearchResultExport(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && "entities" in value;
  isInstance = isInstance && "attrinfo" in value;
  isInstance = isInstance && "exportStyle" in value;

  return isInstance;
}

export function AdvancedSearchResultExportFromJSON(
  json: any
): AdvancedSearchResultExport {
  return AdvancedSearchResultExportFromJSONTyped(json, false);
}

export function AdvancedSearchResultExportFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AdvancedSearchResultExport {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    entities: json["entities"],
    attrinfo: (json["attrinfo"] as Array<any>).map(
      AdvancedSearchResultAttrInfoFromJSON
    ),
    hasReferral: !exists(json, "has_referral")
      ? undefined
      : json["has_referral"],
    referralName: !exists(json, "referral_name")
      ? undefined
      : json["referral_name"],
    entryName: !exists(json, "entry_name") ? undefined : json["entry_name"],
    isAllEntities: !exists(json, "is_all_entities")
      ? undefined
      : json["is_all_entities"],
    exportStyle: json["export_style"],
  };
}

export function AdvancedSearchResultExportToJSON(
  value?: AdvancedSearchResultExport | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    entities: value.entities,
    attrinfo: (value.attrinfo as Array<any>).map(
      AdvancedSearchResultAttrInfoToJSON
    ),
    has_referral: value.hasReferral,
    referral_name: value.referralName,
    entry_name: value.entryName,
    is_all_entities: value.isAllEntities,
    export_style: value.exportStyle,
  };
}