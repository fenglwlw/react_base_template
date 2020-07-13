import React from 'react';
import PropTypes from 'prop-types';
import selected from 'images/selected.png';
import no_select from 'images/no_select.png';
class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }
    itemClick = (index, value, e) => {
        const {onChange} = this.props;
        if (this.state.selectedIndex !== index) {
            e.nativeEvent = e.nativeEvent ? e.nativeEvent : {};
            e.nativeEvent.selectedSegmentIndex = index;
            e.nativeEvent.value = value;
            if (onChange) {
                onChange(e);
            }
            this.setState({
                selectedIndex: index
            });
        }
    }
    render() {
        const {values} = this.props;console.log(values)
        return (
            <div className="ws_tabbar">
                <div className="line_top"></div>
                <ul className="clearfix">
                    {
                        values.map((item, index) => {
                            return (
                                <li key={index} onClick={(e) => this.itemClick(index, item.text, e)} style={{width: `${100/values.length}%`}}>
                                    <img src={(this.state.selectedIndex===index)?selected:no_select} />
                                    <p className={(this.state.selectedIndex===index)?"text active":"text"}>{item.text}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

TabBar.propTypes = {
    values: PropTypes.array,
};

export default TabBar;