/* @flow */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Profile from 'components/Profile';
import {userInfo, getUserInfo} from 'redux/modules/userInfo';
import {helloList,getHelloList} from 'redux/modules/hello';
import strings from 'strings';
import {setStorage} from 'routes/helper';
import list from './list.scss';
import word from '../../styles/images/word.png';
import excel from '../../styles/images/excel.png';
import picture from '../../styles/images/picture.png';
import other from '../../styles/images/other.png';
import pdf from '../../styles/images/pdf.png';
import ppt from '../../styles/images/ppt.png';

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helloValue: 'loading'
    };
  }

  componentDidMount() {
    document.title = '资料详情';
    if (this.props.loginFailed && this.props.stucode.length === 0) {
      setStorage('login', false);
      this.props.userInfo.call(this);
      this.props.getUserInfo.call(this);
    } else {
      this.props.helloList.call(this);
      this.props.getHelloList.call(this);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.username !== this.props.username) {
      if (newProps.loginFailed) {
        alert(strings.NOT_LOGIN_MSG);
        setStorage('login', false);
      } else {
        setStorage('login', true);
        this.props.helloList.call(this);
        this.props.getHelloList.call(this);
      }

    }
    if (newProps.helloText != this.props.helloText) {
      this.setState({
        helloValue: newProps.helloValue
      });
    }
  }


  render() {
    let searchParam = {
      loginState: this.props.loginFailed,
      schcode: this.props.schcode,
      stucode: this.props.stucode
    }
    return (
      <div>
        <ul className="list">
          <li>
            <img src={word} className="img"/>
            <div className="main_box">
              <p className="title">大会演讲PPT</p>
              <div className="desc">
                <p className="size">2.2M</p>
                <p className="date">2018-11-02 12:22</p>
              </div>
            </div>
          </li>
          <li>
            <img src={ppt} className="img"/>
            <div className="main_box">
              <p className="title">大会演讲PPT</p>
              <div className="desc">
                <p className="size">2.2M</p>
                <p className="date">2018-11-02 12:22</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
ListView.propTypes = {
  schcode: PropTypes.string.isRequired,
  stucode: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  loginFailed: PropTypes.bool.isRequired,
  photo: PropTypes.string.isRequired,
  userInfo: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  const {schcode, stucode, username, photo, failed} = state.userInfo;
  const {helloText, helloValue} = state.hello;
  return {
    schcode,
    stucode,
    username,
    photo,
    loginFailed: failed,
    helloText,
    helloValue
  };
};
export default connect((mapStateToProps), {
  userInfo,
  getUserInfo,
  helloList,
  getHelloList
})(ListView);
