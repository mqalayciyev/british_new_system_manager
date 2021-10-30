import React from 'react';

function Footer(params) {
    return (
        <footer className="main-footer">
            <strong>Copyright &copy; 2021-{ new Date().getFullYear() } <a href="https://adminlte.io">Todrix</a>. </strong> All rights reserved.
        </footer>
    )
}

export default Footer;