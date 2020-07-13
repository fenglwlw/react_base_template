import React from 'react';
import BackImage from './back.png';

export default class BackButton extends React.Component {
  go_back () {
    history.go(-1);
  }

  render () {
    return (
      <div className='ws_actionbar_back' onClick={this.go_back}>
        <img src={BackImage} alt='返回' />
        返回
      </div>
    );
  }
}
