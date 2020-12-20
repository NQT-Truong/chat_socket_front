import React from 'react';
import {useSelector} from "react-redux";

const Main = (props) => {

    const app = useSelector(state => state.app);

    const className = props.auth ? "sidebar-close" : app.isOpenSidebar ? "sidebar-open" : "sidebar-close";

    return (
        <div className={`main ${className}`}>
            {props.children}
        </div>
    )
};
export default Main;
