import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './CSS/style.css'


import 'bootstrap/dist/js/bootstrap.bundle.min';


import BreadCrumb from './Components/BreadCrumb';
import MyTasks from './Components/MyTasks/MyTasks';
import Completed from './Components/MyTasks/Completed';
import Profile from './Components/Profile/Profile';
import User from './Components/User/Profile';
import Leads from './Components/Leads/Leads';
import Messages from './Components/Messages/Messages';
import Chat from './Components/Messages/Chat';

import CorparateClients from './Components/Company/CorparateClients';
import AcademicStaff from './Components/Company/AcademicStaff';
import AdministrativeStaff from './Components/Company/AdministrativeStaff';
// import TeachersAvailable from './Components/Company/TeachersAvailable';
import CompanyAnnouncements from './Components/Company/CompanyAnnouncements';
import Offices from './Components/Company/Offices';

import AttendanceMap from './Components/Schooling/AttendanceMap';
import GroupLessons from './Components/Schooling/GroupLessons';
import DemoLessons from './Components/Schooling/DemoLessons';
import Exams from './Components/Schooling/Exams';
import PrivateLessons from './Components/Schooling/PrivateLessons';
import StudentsSchooling from './Components/Schooling/Students';

import Media from './Components/OnlineTutoring/Media';
import TestsOnlineTutoring from './Components/OnlineTutoring/Tests';
// import HomeWork from './Components/OnlineTutoring/HomeWork';

// import Calendar from './Components/Scheduling/Calendar'; 

import Payments from './Components/Finance/Payments';
import PaymentsDue from './Components/Finance/PaymentsDue';

import TeachersEvaluation from './Components/Evaluation/Teachers';

import CompanySettings from './Components/Settings/Company';
import Notifications from './Components/Settings/Notifications'; 

import NotFound from './NotFound';


import Footer from './Components/Footer';
// import Preloader from './Components/Preloader';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';


class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        
        
        
        <Router>
        <Header />
        
          <Sidebar />
            <div className="content-wrapper">
                <BreadCrumb />
                <section className="content">
                    <div className="container-fluid">
                            <Switch>
                                <Route path={`/`} exact>
                                  <MyTasks/>
                                </Route>
                                <Route path={`/TasksActual`}>
                                  <MyTasks />
                                </Route>
                                <Route path={`/TasksCompleted`}>
                                  <Completed />
                                </Route>
                                <Route path={`/Profile`} component={Profile} />
                                <Route path={`/User/:id`} component={User} />
                                <Route path={`/Lead`} component={Leads} />
                                <Route path={`/Messages`} component={Messages} exact />
                                <Route path={`/Messages/Chat/:id`} component={Chat} />
                                
                                {/* <Route path={`/MessagesUser`} component={Chat} /> */}
                                <Route path={`/CompanyCorporateClient`} component={CorparateClients} />
                                <Route path={`/CompanyOffice`} component={Offices} />
                                <Route path={`/CompanyAdministrativeStaff`} component={AdministrativeStaff} />
                                <Route path={`/CompanyAcademicStaff`} component={AcademicStaff} />
                                {/* <Route path={`/CompanyTeachersAvailable`} component={TeachersAvailable} /> */}
                                <Route path={`/CompanyCompanyAnnouncements`} component={CompanyAnnouncements} />

                                <Route path={`/SchoolingStudents`} component={StudentsSchooling} />
                                <Route path={`/SchoolingGroupLessons`} component={GroupLessons} />
                                <Route path={`/SchoolingPrivateLessons`} component={PrivateLessons} />
                                <Route path={`/SchoolingDemoLessons`} component={DemoLessons} />
                                <Route path={`/SchoolingExams`} component={Exams} />
                                <Route path={`/SchoolingAttendanceMap`} component={AttendanceMap} />

                                <Route path={`/OnlineTutoringTests`} component={TestsOnlineTutoring} />
                                <Route path={`/OnlineTutoringMedia`} component={Media} />

                                {/* <Route path={`/SchedulingCalendar`} component={Calendar} /> */}

                                <Route path={`/FinancePayments`} component={Payments} />
                                <Route path={`/FinancePaymentsDue`} component={PaymentsDue} />

                                <Route path={`/EvaluationTeachers`} component={TeachersEvaluation} />

                                <Route path={`/SettingsCompany`} component={CompanySettings} />
                                <Route path={`/Notifications`} component={Notifications} />
                                <Route component={NotFound} />
                            </Switch>
                    </div>
                </section>
            </div>
        </Router>
        <Footer />
      </div>
    );
    
  }
}

export default App;

