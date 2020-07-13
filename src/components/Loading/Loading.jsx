/**
 * Created by fandetao on 16/8/23.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'react-weui';
import  'weui';
class Loading extends React.Component {
  constructor(props){
		super(props);
		this.state = {
      courseLoading:false
		};
    this.courseLoading  = false;
		// this.next = this.next.bind(this);
	}
  componentDidMount(){
    const { loadingtime } = this.props;
    this.courseLoading = false;
    if(loadingtime){
      var that = this;
      function settrue(){
        that.courseLoading = true;
        that.setState({courseLoading:true});
      }
      var t = setTimeout(settrue,loadingtime);
    }
  }
  componentWillReceiveProps(newProps){
    if(newProps.show){
      this.courseLoading = false;
      const { loadingtime } = this.props;
      if(loadingtime){
        var that = this;
        function settrue(){
          that.courseLoading = true;
          that.setState({courseLoading:true});
        }
        var t = setTimeout(settrue,loadingtime);
      }
    }
  }

  render() {
    const {text, show, loadingtime}=this.props;
    if(loadingtime){
      return (
        <Toast show={show && this.courseLoading} icon='loading'>
          {text||'加载中...'}
        </Toast>)
    }else{
      return (
        <Toast show={show } icon='loading'>
          {text||'加载中...'}
        </Toast>
      );
    }
  }
}

Loading.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool
};

export default Loading;
