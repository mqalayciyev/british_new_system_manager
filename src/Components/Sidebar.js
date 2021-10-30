import React from 'react';
import img from '../img/profile.jpg';
// import env from "react-dotenv";
// import axios from 'axios';
import { Link, useLocation  } from "react-router-dom";


function SideBar(params) {

    
    const location = useLocation();

    const { pathname } = location;
    let userInfo = JSON.parse(localStorage.getItem('user-info'))

    const splitLocation = pathname.split("/");
    return (
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <div className="sidebar" style={{ overflowY: 'auto' }}>
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src={userInfo.user.user_info.image ?  process.env.REACT_APP_URL + '/' + userInfo.user.user_info.image : img} className="img-circle elevation-2" alt="user" />
                        </div>
                        <div className="info">
                            <Link to="/Profile" className="d-block">{`${userInfo.user.user_info.first_name} ${userInfo.user.user_info.last_name}`}</Link>
                        </div>
                    </div>

                    <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column fixed" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item">
                        <Link to="/" className={splitLocation[1] === "" || splitLocation[1] === 'TasksCompleted' || splitLocation[1] === 'TasksActual' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fa fa-list-alt"></i>
                                <p> My tasks </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Lead" className={splitLocation[1] === "Lead" ? "nav-link active" : "nav-link"}> 
                                <i className="nav-icon far fa-user"></i>
                                <p>
                                 Leads
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Messages" className={splitLocation[1] === "Messages" ? "nav-link active" : "nav-link"}> 
                                <i className="nav-icon far fa-envelope"></i>
                                <p>
                                 Messages
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fas fa-home"></i>
                                <p>
                                Company
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/CompanyCorporateClient" className={splitLocation[1] === "CompanyCorporateClient" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Corporate clients</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/CompanyOffice" className={splitLocation[1] === "CompanyOffice" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Offices</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/CompanyAdministrativeStaff" className={splitLocation[1] === "CompanyAdministrativeStaff" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Administrative staff</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/CompanyAcademicStaff" className={splitLocation[1] === "CompanyAcademicStaff" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Academic staff</p>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link to="/CompanyTeachersAvailable" className={splitLocation[1] === "CompanyTeachersAvailable" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Teachers available</p>
                                    </Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link to="/CompanyCompanyAnnouncements" className={splitLocation[1] === "CompanyCompanyAnnouncements" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Company announcements</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fa fa-graduation-cap"></i>
                                <p>
                                Schooling
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/SchoolingStudents" className={splitLocation[1] === "SchoolingStudents" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Students</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SchoolingGroupLessons" className={splitLocation[1] === "SchoolingGroupLessons" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>GroupLessons</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SchoolingPrivateLessons" className={splitLocation[1] === "SchoolingPrivateLessons" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Private lessons</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SchoolingDemoLessons" className={splitLocation[1] === "SchoolingDemoLessons" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Demo lessons</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SchoolingExams" className={splitLocation[1] === "SchoolingExams" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Exams</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SchoolingAttendanceMap" className={splitLocation[1] === "SchoolingAttendanceMap" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Attendance map</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fa fa-tv"></i>
                                <p>
                                Online tutoring
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview open">
                                <li className="nav-item">
                                    <Link to="/OnlineTutoringMedia" className={splitLocation[1] === "OnlineTutoringMedia" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Media</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/OnlineTutoringTests" className={splitLocation[1] === "OnlineTutoringTests" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Tests</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon far fa-calendar-alt"></i>
                                <p>
                                Scheduling
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/SchedulingCalendar" className={splitLocation[1] === "SchedulingCalendar" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Calendar</p>
                                    </Link>
                                </li>
                            </ul>
                        </li> */}
                        
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fas fa-coins"></i>
                                <p>
                                Finance
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/FinancePayments" className={splitLocation[1] === "FinancePayments" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Payments</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/FinancePaymentsDue" className={splitLocation[1] === "FinancePaymentsDue" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Payments due</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fas fa-star-half-alt"></i>
                                <p>
                                Evaluation
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/EvaluationTeachers" className={splitLocation[1] === "EvaluationTeachers" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Teachers</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link">
                                <i className="nav-icon fas fa-tools"></i>
                                <p>
                                Settings
                                <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/SettingsCompany" className={splitLocation[1] === "SettingsCompany" ? "nav-link active" : "nav-link"}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Company</p>
                                    </Link>
                                </li>
                                
                                
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/Notifications" className={splitLocation[1] === "Notifications" ? "nav-link active" : "nav-link"}> 
                                <i className="nav-icon far fa-bell"></i>
                                <p>
                                Notifications
                                </p>
                            </Link>
                        </li>
                    </ul>
                    </nav>
                </div>
            </aside>
    )
}

export default SideBar;