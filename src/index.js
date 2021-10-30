import React from 'react';
import ReactDOM from 'react-dom';
import SessionContextProvider from './Context/Session';
import './loader';



import Master from './Master';



ReactDOM.render(
    

    <React.StrictMode>
        <SessionContextProvider>
            <Master />
        </SessionContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

