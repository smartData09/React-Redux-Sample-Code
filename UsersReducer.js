/**
 * @reducer       : UsersReducer
 * @description   : handle currently login user data
 * @Created by    : smartData
 */

import { createReducer } from '../utils';
import { GET_USER_CONST } from '../actions/Constants';

const initialState = {
    data : null,
    userById : [],
    usersList : [],
    userServices : [],
    isFetching : true,
    isAuthenticated : false,
    isAuthenticating : false,
    statusCode : null,
    statusText : null,
    details : [],
    editUser : [],
    totalUsers : null,

    initialValues : {
      first_name : null,
      last_name : null,
      employee_id : null,
      email : null,
      phone_mobile : null,
      phone_work : null,
      department : null,
      role : null,
      is_hospital_admin : false
    }
};

export default createReducer(initialState, {

    [GET_USER_CONST.GET_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': true
        });
    },
    [GET_USER_CONST.GET_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'data': payload,
            'isFetching': false
        });
    },
    [GET_USER_CONST.GET_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': false
        });
    },
    [GET_USER_CONST.GET_USER_BYID_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': true
        });
    },
    [GET_USER_CONST.GET_USER_BYID_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'userById': payload,
            'isFetching': false
        });
    },
    [GET_USER_CONST.GET_USER_BYID_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': false
        });
    },
    [GET_USER_CONST.USERS_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': true
        });
    },
    [GET_USER_CONST.USERS_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'usersList': payload,
            'isFetching': false
        });
    },
    [GET_USER_CONST.TOTAL_USERS_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'totalUsers': payload,
            'isFetching': false
        });
    },
    [GET_USER_CONST.USERS_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': false
        });
    },
    [GET_USER_CONST.POST_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.POST_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });

    },
    [GET_USER_CONST.POST_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    },
    [GET_USER_CONST.UPDATE_USER_FORM_VALUES]: (state, payload) => {
        return Object.assign({}, state, {
            'editUser': payload,
            'first_name' : payload.first_name,
            'last_name' : payload.last_name,
            'employee_id' : payload.employee_id,
            'email' : payload.email,
            'phone_mobile' : payload.phone_mobile,
            'phone_work' : payload.phone_work,
            'department' : payload.department_id,
            'role': payload.role_id,
            'is_hospital_admin': payload.is_tenant_admin,
            'isFetching': false
        });
    },
    [GET_USER_CONST.POST_USER_DEPARTMENT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.POST_USER_DEPARTMENT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });

    },
    [GET_USER_CONST.POST_USER_DEPARTMENT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    },
    [GET_USER_CONST.POST_USER_SERVICES_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.POST_USER_SERVICES_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.POST_USER_SERVICES_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    },
    [GET_USER_CONST.REMOVE_USER_DEPARTMENT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.REMOVE_USER_DEPARTMENT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.REMOVE_USER_DEPARTMENT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    },
    [GET_USER_CONST.REMOVE_USER_SERVICE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.REMOVE_USER_SERVICE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.REMOVE_USER_SERVICE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    },
    [GET_USER_CONST.PUT_USER_PASSWORD_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.PUT_USER_PASSWORD_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.PUT_USER_PASSWORD_FAILURE]: (state, payload) => {console.log("reducer----", payload);
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusCode': payload.status,
            'statusText': payload.statusText,
            'details' : payload.details
        });
    },
    [GET_USER_CONST.GET_USER_SERVICES_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': true
        });
    },
    [GET_USER_CONST.GET_USER_SERVICES_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'userServices': payload,
            'isFetching': false
        });
    },
    [GET_USER_CONST.GET_USER_SERVICES_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': false
        });
    },
    [GET_USER_CONST.PUT_USER_GROUPS_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [GET_USER_CONST.PUT_USER_GROUPS_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'statusText': null
        });

    },
    [GET_USER_CONST.PUT_USER_GROUPS_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': payload.statusText
        });
    }
});
