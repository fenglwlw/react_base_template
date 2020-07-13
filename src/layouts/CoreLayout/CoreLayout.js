import React from 'react';
import PropTypes from 'prop-types';
let height = document.documentElement.clientHeight;

const CoreLayout = ({ children }) => (
    <div className='page-container'
        style={{
            height: height,
            overflow: 'auto'
        }}
    >
        {children}
    </div>
);

CoreLayout.propTypes = {
    // children: PropTypes.element.isRequired
};

export default CoreLayout;