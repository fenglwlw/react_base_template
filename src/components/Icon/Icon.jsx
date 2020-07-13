/**
 * Created by 汪洋 on 2018/4/17
 */
import React from 'react';
import PropTypes from 'prop-types';
import './iconfont.js';
import help from './help.png';
import success from './success.png';
import failed from './failed.png';
import caution from './caution.png';
import waiting from './waiting.png';
import iconmore from './iconmore.png';
import no_select from './no_select.png';
import selected from './selected.png';
import unselect from './unselect.png';
import deletes from './deletes.png';
import single_select from './single_select.png';
import new_message from './new_message.png';
/**
 * ws switch style for checkbox
 *
 */
const Icon = (props) => {
    let { type, number, ...others } = props;
    if (!type && props.location && props.location.state) {
        type = props.location.state.type;
    }
    return (
        <div>
            {type && type == 'one_message' && <div className="ws_icon_one_message" {...others}>
                <p className="one_message">{number ? (number > 99 ? 99 : number) : 1}</p>
            </div>}
            {type && type == 'red_dot' && <div className="ws_icon_red_dot" {...others}></div>}
            {type && type == 'more_message' && <div className="ws_icon_more_message" {...others}>
                <p className="more_message">...</p>
            </div>}
            {type && type == 'new_message' && <img className="ws_icon_img" src={new_message} alt="" {...others} />}
            {type && type == 'deletes' && <img className="ws_icon_img" src={deletes} alt="" {...others} />}
            {type && type == 'selected' && <img className="ws_icon_img" src={selected} alt="" {...others} />}
            {type && type == 'unselect' && <img className="ws_icon_img" src={unselect} alt="" {...others} />}
            {type && type == 'no_select' && <img className="ws_icon_img" src={no_select} alt="" {...others} />}
            {type && type == 'single_select' && <img className="ws_icon_img" src={single_select} alt="" {...others} />}
            {type && type == 'search' && <img className="ws_icon_img" src={single_select} alt="" {...others} />}
            {type && type == 'more' && <img className="ws_icon_img" src={iconmore} alt="" {...others} />}
            {type && type == 'help' && <img className="ws_icon_img" src={help} alt="" {...others} />}
            {type && type == 'success' && <img className="ws_icon_big" src={success} alt="" {...others} />}
            {type && type == 'failed' && <img className="ws_icon_big" src={failed} alt="" {...others} />}
            {type && type == 'waiting' && <img className="ws_icon_big" src={waiting} alt="" {...others} />}
            {type && type == 'caution' && <img className="ws_icon_big" src={caution} alt="" {...others} />}
        </div>
    );
};
Icon.propTypes = {
    type: PropTypes.string,
    number: PropTypes.number
};
export default Icon;
