import React, { Component } from 'react'
// import { createBrowserHistory } from "history";
export const SessionContext = React.createContext();
SessionContext.displayName = 'SessionContext';


export class SessionContextProvider extends Component {
    constructor (props){
        super(props);

        // this.history = createBrowserHistory();

        this.state = {
            session: false,
            manager: [],
        };
    }

    componentDidMount = async event =>{
        let userInfo = localStorage.getItem('user-info')
        if(localStorage.hasOwnProperty('user-info')){
            this.setState({session: true, manager: JSON.parse(userInfo)})
            
        }
        
    }
    
    setSession = (status, value) => {
        if(status === 'success'){
            this.setState({session: true, manager: value})
        }
        else{
            this.setState({session: false, manager: []})
        }
        
        
    }
    render() {
        return (
            <SessionContext.Provider value={{...this.state, setSession: this.setSession}}>
                {this.props.children}
            </SessionContext.Provider>
        )
    }
}

export default SessionContextProvider;
