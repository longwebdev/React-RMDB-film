import React from 'react';
import './LoadMoreBtn.css'
const LoadMoreBtn = (props) => (
    <div className="rmdb-loadmorebtn" onClick={props.onClick}>
        <p>{props.text}</p>
    </div>
);



export default LoadMoreBtn;