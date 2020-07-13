/**
 * Created by 汪洋 on 2018/4/17
 */
import React from 'react';
import PropTypes from 'prop-types';
import './iconfont';
import whistleToast from './whistleToast.scss';
class WhistleToast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    const {text, type, millisecond} = this.props;
    if (this.state.show) {
      this.timeout = setTimeout(() => {
        this.setState({show: false});
      }, millisecond || 1500);
      if (type === 'attention') {
        return (
          <div className='ws-toast'>
            <div className="ws-icon_toast">
              <svg className="ws-toast_icon" style={{ 'color': '#fff' }}>
                <use xlinkHref="#icon-tishi"></use>
              </svg>
              {/*<Icon type="exclamation-circle-o" style={{ fontSize: 32, color: '#fff' }} />*/}
            </div>
            <p className="ws-toast__content">{text}</p>
          </div>
        );
      } else if (type === 'failed') {
        return (
          <div className='ws-toast'>
            <div className="ws-icon_toast">
              <svg className="ws-toast_icon" style={{ 'color': '#fff' }}>
                <use xlinkHref="#icon-error"></use>
              </svg>
              {/*<Icon type="close-circle-o" style={{ fontSize: 32, color: '#fff' }} />*/}
            </div>
            <p className="ws-toast__content">{text}</p>
          </div>
        );
      } else if (type === 'toptips') {
        return (
          <div className='ws-toast_toptips'>
            {text}
          </div>
        );
      } else {
        return (
          <div className='ws-toast'>
            <div className="ws-icon_toast">
              <svg className="ws-toast_icon" style={{ 'color': '#fff' }}>
                <use xlinkHref="#icon-success"></use>
              </svg>
              {/*<Icon type="check-circle-o" style={{ fontSize: 32, color: '#fff' }} />*/}
            </div>
            <p className="ws-toast__content">{text}</p>
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }
}

WhistleToast.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  millisecond: PropTypes.number
};
export default WhistleToast;
