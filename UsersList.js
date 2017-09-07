/**
 * @Component : UsersList Component
 * @description
 * @Created   : smartData
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUsers, getTotalUsers } from '../../actions/UsersActions';
import { getDepartmenById } from '../../actions/DepartmentActions';
import { browserHistory } from 'react-router';

//import Loader from '../Common/Loader';
import ModalWindow from '../Modals/AddRoleModal';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';
import ButtonM from 'muicss/lib/react/button';
import { Link } from 'react-router';
import Multiselect from 'react-widgets/lib/Multiselect';
import Pagination from '../Common/Pagination';
import { PAGINATION_DEFAULT_LIMIT } from '../../actions/Constants';

class UsersLists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: false,
            isActive: true,
            usersData: [],
            department : null,
            token : null,
            isTenantAdmin: false,
            totalUsers: null,
            rowOrder: 'desc'
        };
        this.open_modal = this.open_modal.bind(this);
    }

    open_modal(data) {
        this.setState({
            modal1: !this.state.modal1
        });
    }

    componentDidMount() {
        document.title = "Signout - Users";
    }

    componentWillMount() {

      this.props.getTotalUsers(this.props.token);

      let limit = PAGINATION_DEFAULT_LIMIT;
      let orderBy = 'id';
      let order = 'desc';
      let query = `?limit=${limit}&orderBy=${orderBy}&order=${order}`;
      this.props.getUsers(this.props.token, query);
      this.setState({token: this.props.token});
    }

    componentWillReceiveProps( nextProps ) {

        if (nextProps.totalUsers) {
            this.setState({ totalUsers : nextProps.totalUsers });
        }

        if (nextProps.currentLoginUser) {
           this.setState({ isTenantAdmin : nextProps.currentLoginUser.is_tenant_admin });
        }

        if ( nextProps.users && this.props.users !== nextProps.users ) {
            let users = nextProps.users;
            this.setState( { usersData : users } );
        }
    }

    getDepartmentName( departmenId ) {
      this.props.getDepartmenById(departmenId, this.state.token);
    }

    searchUser(e, searchValue) {
      e.preventDefault();

      let limit = PAGINATION_DEFAULT_LIMIT;
      let orderBy = 'id';
      let order = 'desc';
      let search = searchValue;
      let query = `?search=${searchValue}&limit=${limit}&orderBy=${orderBy}&order=${order}`;
      this.props.getUsers(this.props.token, query);
    }

    sortRowByFieldName(e, fieldName) {

      let orderType = this.state.rowOrder === 'desc' ? 'asc' : 'desc';
      this.setState({ rowOrder : orderType });

      //console.log(fieldName, this.state.rowOrder);

      let limit = PAGINATION_DEFAULT_LIMIT;
      let orderBy = fieldName;
      let order = this.state.rowOrder;
      let query = `?limit=${limit}&orderBy=${orderBy}&order=${order}`;
      this.props.getUsers(this.props.token, query);
    }

    renderRow() {

      if(this.props.isFetching) {
        return(
          <tr>
            <td colSpan="5">
              <div className="loader" id="loader-4">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </td>
          </tr>
        );
      }

      if(this.state.usersData.length <= 0) {
        return (
          <tr>
            <td colSpan="5">
                No User.
            </td>
          </tr>
        );
      }

      if( this.state.usersData ) {
        return this.state.usersData.map(( user ) => {
        //let department = this.getDepartmentName( user.department_id )
        //{ user.role_id ? user.role_id : 'n/a' }
        //{ user.department_id ? user.department_id : 'n/a' }
          return (

            <tr key= { user.id }>
                <td>{ user.first_name } { user.last_name }</td>
                <td>{ user.email }</td>
                <td>
                  { user.phone_mobile ? user.phone_mobile : 'n/a' } <br />
                  { user.phone_work ? user.phone_work : 'n/a' }
                </td>
                <td>{ user.role.name ? user.role.name : 'n/a' }</td>
                <td>{ user.department.name ? user.department.name : 'n/a' }</td>
                { (this.state.isTenantAdmin === true) ?
                <td>
                  <Link to={`/create-user/${user.id}`}>
                    <button
                      className="action-btn"
                      data-toggle="modal"
                      data-target="#edit-patient1">
                      <i className="zmdi zmdi-edit"></i>
                    </button>
                  </Link>
                  {/**<button className="action-btn"><i className="zmdi zmdi-delete"></i></button>**/}
                </td>
                : <td></td> }
            </tr>
          );
        });
      }
    }

    render() {
        return(

          <div id="page-content-wrapper">
              {/*<!-- Page Content -->*/}
              <div className="col welcome-bar ">
                  {/*<!-- welcome bar -->*/}
                  <h1 className="page-title">Users List</h1>
                  <ul className="breadcrumb pull-right hidden-xs-down">
                      <li><Link to={`/signoutlist`}>Sign out</Link></li>
                      <li className="active">Users</li>
                  </ul>
              </div>

              <ModalWindow modal_var = {this.state.modal1} handle_modal = { this.open_modal} token={this.props.token} />

              <div className="container-fluid mrg-top30 pd-bt30">

                  <div className="col pd-off-xs loader-cover">

                      <div className="row">
                          <div className="col-sm-12">
                              <div className="white-bg">
                                { (this.state.isTenantAdmin === true) ?
                                  <Link to="/create-user" className="logo">
                                    <ButtonM
                                          type="button"
                                          className="ripple r-round btn blue-btn add-btn"
                                          data-toggle="modal"
                                          data-target="#create-patient">
                                          <span className="hidden-xs-down">CREATE USERS</span>
                                          <img className="hidden-sm-up" src="/client/assets/images/add-file.png" />
                                    </ButtonM>
                                  </Link>
                                  : "" }

                                  <div className="form-group search-bar">
                                      <input className="inputMaterial"
                                             type="text" required
                                             onChange={ (e) => this.searchUser(e, e.target.value) } />
                                      <span className="highlight"></span> <span className="bar"></span>
                                      <label>Search users by name and email</label>
                                      <button className="search-icon"><i className="zmdi zmdi-search "></i></button>
                                  </div>
                                  <div className="table-responsive">
                                      <table className="table table-hover patient-list user_lt">
                                          {/*<!--table start-->*/}
                                          <thead>
                                              <tr>
                                                  <th width="20%" onClick={ (e) => this.sortRowByFieldName(e, 'first_name') }>Name<span className="set"><i className="zmdi zmdi-chevron-up"></i><i className="zmdi zmdi-chevron-down"></i></span></th>
                                                  <th width="20%">Email</th>
                                                  <th width="15%">Phone</th>
                                                  <th width="15%" onClick={ (e) => this.sortRowByFieldName(e, 'role') }>Roles<span className="set"><i className="zmdi zmdi-chevron-up"></i><i className="zmdi zmdi-chevron-down"></i></span></th>
                                                  <th width="20%" onClick={ (e) => this.sortRowByFieldName(e, 'department') }>Department<span className="set"><i className="zmdi zmdi-chevron-up"></i><i className="zmdi zmdi-chevron-down"></i></span></th>
                                                  <th width="10%">{ (this.state.isTenantAdmin === true) ? 'Action' : '' }</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              { this.renderRow() }
                                          </tbody>
                                      </table>
                                      {/*<!--table End-->*/}
                                  </div>
                                  {(this.state.usersData.length > 0) ?
                                  <Pagination
                                            token = { this.state.token }
                                            pageName = "TENANT_USERS"
                                            totalPages ={ this.state.totalUsers } /> : ''
                                  }
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
		      );
    }
}

/**
 * [mapStateToProps description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function mapStateToProps(state) {
     return {
         isFetching: state.users.isFetching,
         users: state.users.usersList,
         totalUsers: state.users.totalUsers
     }
}

export default connect(mapStateToProps, { getUsers, getTotalUsers, getDepartmenById })(UsersLists);
