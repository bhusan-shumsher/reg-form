
import {NavLink} from 'react-router-dom';

export default function AdminSideBar(){
    return(
<div className="sidebar" id="sidebar">
<div className="sidebar-inner slimscroll">
<div id="sidebar-menu" className="sidebar-menu">
<ul>
<li className="menu-title">
<span>Main Menu</span>
</li>
<li className="submenu active">
<NavLink to='/admin/dashboard'><i className="feather-grid"></i> <span> Dashboard</span> <span className="menu-arrow"></span></NavLink>

</li>
<li className="submenu">
<NavLink to='/admin/filter-submission'><i className="fas fa-chalkboard-teacher"></i> <span> Form Submission</span> <span className="menu-arrow"></span></NavLink>

</li>




</ul>
</div>
</div>
</div>
    );
}