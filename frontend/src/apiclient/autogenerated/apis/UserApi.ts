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

import * as runtime from "../runtime";
import {
  UserList,
  UserListFromJSON,
  UserListToJSON,
  UserRetrieve,
  UserRetrieveFromJSON,
  UserRetrieveToJSON,
} from "../models";

export interface UserApiV2UsersRetrieveRequest {
  id: number;
}

/**
 *
 */
export class UserApi extends runtime.BaseAPI {
  /**
   */
  async userApiV2UsersListRaw(
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<Array<UserList>>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/user/api/v2/users`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(UserListFromJSON)
    );
  }

  /**
   */
  async userApiV2UsersList(
    initOverrides?: RequestInit
  ): Promise<Array<UserList>> {
    const response = await this.userApiV2UsersListRaw(initOverrides);
    return await response.value();
  }

  /**
   */
  async userApiV2UsersRetrieveRaw(
    requestParameters: UserApiV2UsersRetrieveRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<UserRetrieve>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling userApiV2UsersRetrieve."
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/user/api/v2/users/{id}`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserRetrieveFromJSON(jsonValue)
    );
  }

  /**
   */
  async userApiV2UsersRetrieve(
    requestParameters: UserApiV2UsersRetrieveRequest,
    initOverrides?: RequestInit
  ): Promise<UserRetrieve> {
    const response = await this.userApiV2UsersRetrieveRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }
}