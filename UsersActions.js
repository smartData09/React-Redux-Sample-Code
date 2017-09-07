/**
 * @action        : UsersActions
 * @description   : Handles all users
 * @Created by    : smartData
 */

import React from 'react';
import qs from 'qs';
import { checkHttpStatus, parseJSON } from '../utils';
import { browserHistory } from 'react-router';
import { tokenExpired } from './LoginActions';
import { successHandler, errorHandler } from './ErrorHandler';

import { AXIOS_INSTANCE,
         GET_USER_CONST,
         TOKEN_BEARER,
         GET_LOGIN_USER_API,
         GET_USERS_API
       } from './Constants';

  /**
   * [getUserRequest user request to api]
   * @return {[OBJECT]} [description]
   */
  export function getUserRequest(REQUEST) {
  	return {
      type: REQUEST,
    	}
  }

  /**
   * [getUserSuccess user api response success]
   * @param  {[type]} data [json data]
   * @return {[OBJECT]}      [json]
   */
  export function getUserSuccess( SUCCESS, data ) {
  	return {
      	type: SUCCESS,
      	payload: data
    	}
  }

  /**
   * [getUserFailure user api response failure]
   * @return {[OBJECT]}      [json]
   */
  export function getUserFailure(FAILURE, error) {
      return {
        type: FAILURE,
        payload: {
          status: error.response.status,
          statusText: error.response.statusText
        }
      }
  }

  /**
   * [getLoginUser Returns the 'me' data for the currently logged in user]
   * @param  {[type]} token [Bearer Token]
   * @return {[OBJECT]}       [json]
   */
  export function getLoginUser( token ) {

      return function(dispatch) {

        dispatch(getUserRequest(GET_USER_CONST.GET_USER_REQUEST));

        let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };
        let flag = 0;
      //  if(token) {
          AXIOS_INSTANCE.get(GET_LOGIN_USER_API, config)
                                         .then(function (response) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.GET_USER_SUCCESS, response.data.data));
                                           } catch (e) {
                                             dispatch(getUserFailure(GET_USER_CONST.GET_USER_FAILURE, {
                                               response: {
                                                 status: 403,
                                                 statusText: 'Unable to fetch data.'
                                               }
                                             }));
                                           }
                                         })
                                         .catch(function (error) {

                                           if(flag > 0) {
                                             // Handle expire token
                                             if(error.response.data.statusCode===401) {// Handle expire token
                                               dispatch(tokenExpired());
                                             } else {// Handle other errors
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                           }
                                           flag = flag + 1;
                                         });
        //}
      }
  }

  export function getTotalUsers( token ) {

      return function(dispatch) {

        dispatch(getUserRequest(GET_USER_CONST.USERS_REQUEST));

        let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

         AXIOS_INSTANCE.get(GET_USERS_API, config)
                                        .then(function (response) {
                                          try {
                                            dispatch(getUserSuccess(GET_USER_CONST.TOTAL_USERS_SUCCESS, response.data.data.length));
                                          } catch (e) {
                                            console.log('getUsers', e);
                                          }
                                        })
                                        .catch(function (error) {
                                           // Handle expire token
                                           if(error.response.data.statusCode===401) {// Handle expire token
                                             dispatch(tokenExpired());
                                           } else {// Handle other errors
                                             dispatch(errorHandler(GET_USER_CONST.USERS_FAILURE, {
                                               response: {
                                                 status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                 errorType: error.response.data.error,        //Forbidden
                                                 statusText: error.response.data.message
                                               }
                                             }));
                                           }
                                        });
      }
  }

  /**
   * [getUsers Returns a list of users]
   * @param  {[type]} token [Bearer]
   * @return {[OBJECT]}       [json]
   */
   export function getUsers( token, query='' ) {

       return function(dispatch) {

         dispatch(getUserRequest(GET_USER_CONST.USERS_REQUEST));

         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

          AXIOS_INSTANCE.get(`${GET_USERS_API}${query}`, config)
                                         .then(function (response) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.USERS_SUCCESS, response.data.data));
                                           } catch (e) {
                                             console.log('getUsers', e);
                                           }
                                         })
                                         .catch(function (error) {
                                            // Handle expire token
                                            if(error.response.data.statusCode===401) {// Handle expire token
                                              dispatch(tokenExpired());
                                            } else {// Handle other errors
                                              dispatch(errorHandler(GET_USER_CONST.USERS_FAILURE, {
                                                response: {
                                                  status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                  errorType: error.response.data.error,        //Forbidden
                                                  statusText: error.response.data.message
                                                }
                                              }));
                                            }
                                         });
       }
   }

   /**
    * [createUser Create a new user]
    * @param  {[type]} userId   [user id for update user]
    * @param  {[type]} token    [auth token]
    * @param  {[type]} formData [user form data first_name, last_name, email etc.]
    * @return {[type]}          [description]
    */
   export function createUser( token, tenantId, userId, formData ) {

       return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.POST_USER_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

         const postData = qs.stringify({
                               id: userId,
                               status: 'active',
                               is_tenant_admin: formData.is_hospital_admin,
                               tenant_id: tenantId,
                               first_name: formData.first_name,
                               last_name: formData.last_name,
                               employee_id: formData.employee_id,
                               email: formData.email,
                               phone_work: formData.phone_work,
                               phone_mobile: formData.phone_mobile,
                               role_id: formData.role,
                               department_id: formData.department
                           });


        const url = (userId===null) ? GET_USERS_API : `${GET_USERS_API}/${userId}`;
        (userId===null) ? AXIOS_INSTANCE.post(url, postData, config):  AXIOS_INSTANCE.patch(url, postData, config)
                                        .then(checkHttpStatus)
                                        .then(parseJSON)
                                         .then(function ( response ) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.POST_USER_SUCCESS, response));
                                             dispatch(successHandler('Success', {
                                               response: {
                                                 status: 200, //success
                                                 statusText: 'User saved successfully.',
                                                 data: null
                                               }
                                             }));
                                           } catch (e) {
                                             console.log("createUser ");
                                           }
                                         })
                                         .catch(function ( error ) {
                                             if(error.response.data.statusCode===401) {
                                               dispatch(tokenExpired());
                                             } else {
                                               dispatch(getUserFailure(GET_USER_CONST.POST_USER_FAILURE, error));
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                         });
       }
   }

   export function createUserServices( token, userId, serviceId ) {

       return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.POST_USER_SERVICES_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

         const postData = {
                               user_id: userId,
                               service_id: serviceId
                           };
          // POST /users/{id}/services
          // Add user to a service
          AXIOS_INSTANCE.post(`${GET_USERS_API}/${userId}/services`, postData, config)
                                        .then(checkHttpStatus)
                                        .then(parseJSON)
                                         .then(function ( response ) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.POST_USER_SERVICES_SUCCESS, response));
                                             dispatch(successHandler('Success', {
                                               response: {
                                                 status: 200, //success
                                                 statusText: 'User services saved successfully.',
                                                 data: null
                                               }
                                             }));
                                           } catch (e) {
                                             console.log("createUser ");
                                           }
                                         })
                                         .catch(function ( error ) {
                                             if(error.response.data.statusCode===401) {
                                               dispatch(tokenExpired());
                                             } else {
                                               dispatch(getUserFailure(GET_USER_CONST.POST_USER_SERVICES_FAILURE, error));
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                         });
       }
   }

   /**
    * [removeUserServices Remove user from service]
    * @param  {[type]} token     [description]
    * @param  {[type]} userId    [description]
    * @param  {[type]} serviceId [description]
    * @return {[type]}           [description]
    */
   export function removeUserServices( token, userId, serviceId ) {

       return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.REMOVE_USER_SERVICE_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

          AXIOS_INSTANCE.delete(`${GET_USERS_API}/${userId}/services/${serviceId}`, config)
                                        .then(checkHttpStatus)
                                        .then(parseJSON)
                                         .then(function ( response ) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.REMOVE_USER_SERVICE_SUCCESS, response));
                                             dispatch(successHandler('Success', {
                                               response: {
                                                 status: 200, //success
                                                 statusText: 'User service successfully removed.',
                                                 data: null
                                               }
                                             }));
                                           } catch (e) {
                                             console.log("createUser ");
                                           }
                                         })
                                         .catch(function ( error ) {
                                             if(error.response.data.statusCode===401) {
                                               dispatch(tokenExpired());
                                             } else {
                                               dispatch(getUserFailure(GET_USER_CONST.REMOVE_USER_SERVICE_FAILURE, response));
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                         });
       }
   }

   /**
    * [removeUserDepartments Remove User department]
    * @param  {[type]} token  [description]
    * @param  {[type]} userId [description]
    * @param  {[type]} deptId [description]
    * @return {[type]}        [description]
    */
   export function removeUserDepartments( token, userId, deptId ) {

       return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.REMOVE_USER_DEPARTMENT_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

          //DELETE /users/{id}/departments/{deptId}
          AXIOS_INSTANCE.delete(`${GET_USERS_API}/${userId}/departments/${deptId}`, config)
                                        .then(checkHttpStatus)
                                        .then(parseJSON)
                                         .then(function ( response ) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.REMOVE_USER_DEPARTMENT_SUCCESS, response));
                                             dispatch(successHandler('Success', {
                                               response: {
                                                 status: 200, //success
                                                 statusText: 'User department successfully removed.',
                                                 data: null
                                               }
                                             }));
                                           } catch (e) {
                                             console.log("createUser ");
                                           }
                                         })
                                         .catch(function ( error ) {
                                             if(error.response.data.statusCode===401) {
                                               dispatch(tokenExpired());
                                             } else {
                                               dispatch(getUserFailure(GET_USER_CONST.REMOVE_USER_DEPARTMENT_FAILURE, response));
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                         });
       }
   }

   export function createUserDepartments( token, userId, deptId ) {

       return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.POST_USER_DEPARTMENT_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

         const postData = {
                               user_id: userId,
                               department_id: deptId
                           };

        // POST /users/{id}/departments
        // Add user as admin of a department
          AXIOS_INSTANCE.post(`${GET_USERS_API}/${userId}/departments`, postData, config)
                                        .then(checkHttpStatus)
                                        .then(parseJSON)
                                         .then(function ( response ) {
                                           try {
                                             dispatch(getUserSuccess(GET_USER_CONST.POST_USER_DEPARTMENT_SUCCESS, response));
                                             dispatch(successHandler('Success', {
                                               response: {
                                                 status: 200, //success
                                                 statusText: 'User departments saved successfully.',
                                                 data: response.data.data
                                               }
                                             }));
                                           } catch (e) {
                                             console.log("createUser ");
                                           }
                                         })
                                         .catch(function ( error ) {
                                             if(error.response.data.statusCode===401) {
                                               dispatch(tokenExpired());
                                             } else {
                                               dispatch(getUserFailure(GET_USER_CONST.POST_USER_DEPARTMENT_FAILURE, error));
                                               dispatch(errorHandler('Failure', {
                                                 response: {
                                                   status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                   errorType: error.response.data.error,        //Forbidden
                                                   statusText: error.response.data.message
                                                 }
                                               }));
                                             }
                                         });
       }
   }

   /**
    * [getUserById Returns a single user by id]
    * @param  {[type]} token  [access token]
    * @param  {[type]} userId [description]
    * @return {[type]}        [description]
    */
   export function getUserById( token, userId ) {

     return function( dispatch ) {

         dispatch( getUserRequest( GET_USER_CONST.GET_USER_BYID_REQUEST ) );
         let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

         AXIOS_INSTANCE.get( `${GET_USERS_API}/${userId}`, config )
                                         .then(function ( response ) {
                                           try {
                                             dispatch( getUserSuccess( GET_USER_CONST.GET_USER_BYID_SUCCESS, response.data.data ) );
                                           } catch (e) {
                                             console.log("catch : getDepartmenById");
                                           }
                                         })
                                         .catch(function ( error ) {
                                               if(error.response.data.statusCode===401) {
                                                 dispatch(tokenExpired());
                                               } else {
                                                 dispatch( getUserFailure( GET_USER_CONST.GET_USER_BYID_FAILURE, error ) );
                                                 dispatch(errorHandler('Failure', {
                                                   response: {
                                                     status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                     errorType: error.response.data.error,        //Forbidden
                                                     statusText: error.response.data.message
                                                   }
                                                 }));
                                               }
                                         });
       }
   }



export function getUpdate( REQUEST, data ) {
  return {
      type : REQUEST,
      payload: data
    }
}

export function updateUserFormInitialValues( userData ) {
  return function( dispatch ) {
    dispatch( getUpdate( GET_USER_CONST.UPDATE_USER_FORM_VALUES, userData ) );
  }
}




  /**
   * [updateUserPassword PUT /users/{id}/password - Update user password]
   * @param  {[type]} token    [description]
   * @param  {[type]} userId   [description]
   * @param  {[type]} formData [description]
   * @return {[type]}          [description]
   */
  export function updateUserPassword( token, userId, formData ) {

      return function( dispatch ) {

        dispatch( getUserRequest( GET_USER_CONST.PUT_USER_PASSWORD_REQUEST ) );
        let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

        const postData = {
                              current_password: formData.current_password,
                              new_password: formData.new_password
                          };

         // update user password
         AXIOS_INSTANCE.put(`${GET_USERS_API}/${userId}/password`, postData, config)
                                       .then(checkHttpStatus)
                                       .then(parseJSON)
                                        .then(function ( response ) {
                                          try {
                                            dispatch(getUserSuccess(GET_USER_CONST.PUT_USER_PASSWORD_SUCCESS, response));
                                            dispatch(successHandler('Success', {
                                              response: {
                                                status: 200, //success
                                                statusText: 'Your account has been updated successfully.',
                                                data: null
                                              }
                                            }));
                                          } catch (e) {
                                            console.log("createUser ");
                                          }
                                        })
                                        .catch(function ( error ) {
                                            if(error.response.data.statusCode===401) {
                                              dispatch(tokenExpired());
                                            } else {
                                              dispatch(getUserFailurePassword(GET_USER_CONST.PUT_USER_PASSWORD_FAILURE, {
                                                response: {
                                                  status: error.response.data.statusCode,
                                                  statusText: error.response.data.message,
                                                  details : error.response.data.details
                                                }
                                              }));
                                              dispatch(errorHandler('Failure', {
                                                response: {
                                                  status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                  errorType: error.response.data.error,        //Forbidden
                                                  statusText: error.response.data.message
                                                }
                                              }));
                                            }
                                        });
      }
  }

  export function getUserFailurePassword(FAILURE, error) {
      return {
        type: FAILURE,
        payload: {
          status: error.response.status,
          statusText: error.response.statusText,
          details: error.response.details
        }
      }
  }

  /**
   * [getUserServices Returns a list of user's services
                      Also indicates whether the user is part of the services group via user_in_group property]
   * @param  {[type]} token  [description]
   * @param  {[type]} userId [description]
   * @return {[type]}        [description]
   */
  export function getUserServices( token, userId ) {

      return function( dispatch ) {

          dispatch( getUserRequest( GET_USER_CONST.GET_USER_SERVICES_REQUEST ) );
          let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };
          let flag = 0;
          AXIOS_INSTANCE.get( `${GET_USERS_API}/${userId}/services`, config )
                                          .then(function ( response ) {
                                            try {
                                              dispatch( getUserSuccess( GET_USER_CONST.GET_USER_SERVICES_SUCCESS, response.data.data ) );
                                            } catch (e) {
                                              console.log("catch : getUserServices");
                                            }
                                          })
                                          .catch(function ( error ) {
                                              if(flag > 0) {
                                                if(error.response.data.statusCode===401) {
                                                  dispatch(tokenExpired());
                                                } else {
                                                    dispatch( getUserFailure( GET_USER_CONST.GET_USER_SERVICES_FAILURE, error ) );
                                                    dispatch(errorHandler('Failure', {
                                                      response: {
                                                        status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                        errorType: error.response.data.error,        //Forbidden
                                                        statusText: error.response.data.message
                                                      }
                                                    }));
                                                }
                                              }
                                              flag = flag + 1;
                                          });
        }
    }



    /**
     * [updateUserGroups Note: This is a bulk PUT endpoint. You MUST post an array of ALL groups at once.]
     * Update groups for a user.
     * For existing groups for the user, include the id in order to UPDATE.
     * For new groups for the user, include the id.
     * To remove a group for the user, simply omit it from the array.
     * @param  {[type]} token  [description]
     * @param  {[type]} userId [description]
     * @param  {[type]} groups [description]
     * @return {[api]}        [PUT /users/{id}/groups]
     */
    export function updateUserGroups( token, userId, groups ) {

        return function( dispatch ) {

          dispatch( getUserRequest( GET_USER_CONST.PUT_USER_GROUPS_REQUEST ) );
          let config = { 'headers': { 'Authorization': TOKEN_BEARER + token } };

          const postData = {
                                data: groups
                            };

           AXIOS_INSTANCE.put(`${GET_USERS_API}/${userId}/groups`, postData, config)
                                         .then(checkHttpStatus)
                                         .then(parseJSON)
                                          .then(function ( response ) {
                                            try {
                                              dispatch(getUserSuccess(GET_USER_CONST.PUT_USER_GROUPS_SUCCESS, response));
                                              dispatch(successHandler('Success', {
                                                response: {
                                                  status: 200, //success
                                                  statusText: 'User\'s groups successfully updated.',
                                                  data: null
                                                }
                                              }));
                                            } catch (e) {
                                              console.log("createUser ");
                                            }
                                          })
                                          .catch(function ( error ) {
                                              if(error.response.data.statusCode===401) {
                                                dispatch(tokenExpired());
                                              } else {
                                                dispatch(getUserFailure(GET_USER_CONST.PUT_USER_GROUPS_FAILURE));
                                                dispatch(errorHandler('Failure', {
                                                  response: {
                                                    status: error.response.data.statusCode, //error status 401 / 403 / 500
                                                    errorType: error.response.data.error,        //Forbidden
                                                    statusText: error.response.data.message
                                                  }
                                                }));
                                              }
                                          });
        }
    }
