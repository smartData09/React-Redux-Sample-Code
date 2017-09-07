/**
 * @Router        :	Index Router
 * @description   : Application url routing.
 * @Created by    : smartData
 */

import React from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

// Import components to route
import App from '../components/app';
import LoginComponent from '../components/Login/LoginComponent';
import ForgotPwdComponent from '../components/Login/ForgotPwdComponent';
import ResetPwdComponent from '../components/Login/ResetPassword';
import TenantDashboard from '../components/Tenant/TenantDashboard';
import SignOutList from '../components/Tenant/SignoutList';

import ServiceSignoutLists from '../components/SignoutList/SignoutList';
import SignoutTemplates from '../components/SignoutList/SignoutTemplates';

import SignoutDetail from '../components/Tenant/SignoutDetail';
import Patients from '../components/Patients/Patients';
import Services from '../components/Tenant/Services';
import Directories from '../components/Tenant/Directories';
import DepartmentList from '../components/Departments/DepartmentList';
import UsersList from '../components/Users/UsersList';
import CreateUser from '../components/Users/CreateUser';
import RoleList from '../components/Roles/RoleList';
import GroupsList from '../components/Groups/GroupsList';
import ServiceTabs from '../components/Departments/ServiceTabs';
import ComingSoon from '../components/Common/ComingSoon';
import Account from '../components/Tenant/Account';
import FormTestComponent from '../components/Tenant/FormTestComponent';
// Import AuthsComponent - To check login authentication
import { requireAuths } from '../components/AuthsComponent';

export default(
<Router history={browserHistory}>
    <Route path="/" component={LoginComponent}></Route>
    <Route path="/forgot-password" component={ForgotPwdComponent}></Route>
    <Route path="/testing" component={FormTestComponent}></Route>
    <Route path="/reset-password" component={ResetPwdComponent}></Route>
     <Route  component={App}>
           <Route path="/comingsoon" component={ ComingSoon } />
           <Route path="/dashboard" component={ requireAuths(TenantDashboard) } />
           <Route path="/departments" component={ requireAuths(DepartmentList) } />

           <Route path="/service-tabs/(:serviceId)" component={ requireAuths(ServiceTabs) } />

           <Route path="/users" component={ requireAuths(UsersList) } />
             <Route path="/create-user" component={ requireAuths(CreateUser) } >
               <Route path="/create-user" component={requireAuths(CreateUser)} />
               <Route path=":userId" component={requireAuths(CreateUser)} />
             </Route>

           <Route path="/roles" component={ requireAuths(RoleList) } />
           <Route path="/signoutlist" component={ requireAuths(SignOutList) } />

           <Route path="/signout-lists" component={ requireAuths(ServiceSignoutLists) } />
           <Route path="/signout-templates" component={ requireAuths(SignoutTemplates) } />

           <Route path="/signout-detail/(:signoutId)" component={ requireAuths(SignoutDetail) } />

           <Route path="/patients" component={ requireAuths(Patients) } />
           <Route path="/services" component={ requireAuths(Services) } />
           <Route path="/groups" component={ requireAuths(GroupsList) } >
             <Route path="/groups" component={requireAuths(GroupsList)} />
             <Route path=":id" component={requireAuths(GroupsList)} />
           </Route>
           <Route path="/directories" component={ requireAuths(Directories) } />
           <Route path="/account" component={ requireAuths(Account) } />
    </Route>
  <Route path="*" component={LoginComponent}/>
 </Router>
);
