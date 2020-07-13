import React from 'react';
import PropTypes from 'prop-types';
import strings from 'strings';
import { SegmentedControl } from 'antd-mobile';
class Tab extends React.Component {
    render() {
        const {tintColor, bgColor, ...o} = this.props;
        const _tintColor = tintColor || strings.BASECOLOR;
        const _bgColor = bgColor || '#fff';
        return (
            <div className="ws_tab" style={{background: _bgColor}}>
                <SegmentedControl tintColor={_tintColor} {...o} />
            </div>
        )
    }
}

Tab.propTypes = {
    values: PropTypes.array,
};

export default Tab;