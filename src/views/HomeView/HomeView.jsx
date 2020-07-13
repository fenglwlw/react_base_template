import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { helloList, getHelloList } from 'reduxdir/modules/hello';
import strings from 'strings';
import { Link, Route } from 'react-router-dom';
import {closest} from 'utils';
import Tab from 'components/Tab';
import TabBar from 'components/TabBar';
import { DatePicker, Picker, Switch, Modal, WhiteSpace } from 'antd-mobile';
import home from './home.scss';
const prompt = Modal.prompt;
const data_picker = [
    [
        {
            label: '第一教学楼',
            value: '1',
        },
        {
            label: '第一教学楼',
            value: '2',
        }
    ]
]
let value_tabbar = [
    {
        text: 'TabBar1',
    },
    {
        text: 'TabBar2',
    }
]

const WsComponent = () => {
    return [
        <Link key='wsc_1' to="/demo?type=empty"><div className="item">Emptyview</div></Link>,
        <Link key='wsc_2' to="/demo?type=err"><div className="item">ErrView</div></Link>,
        <Link key='wsc_3' to="/demo?type=loading"><div className="item">LoadingView</div></Link>,
        <Link key='wsc_4' to="/demo?type=toast"><div className="item">ToastView</div></Link>,
        <Link key='wsc_5' to="/demo?type=icon"><div className="item">Icon</div></Link>
    ]
}


class AntComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sValue: ['2'],
            checked: true,
            showModal: false,
        };
    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
          return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
          e.preventDefault();
        }
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
          [key]: false,
        });
    }
    render () {
        return (
            <div>
                <DatePicker
                    //value={this.state.date}
                    title="请选择时间" 
                    minDate={new Date()}
                    //onDismiss={() => do sth... } 
                    //onChange={date => }
                >
                    <div className="item">DatePicker</div>
                </DatePicker>
                <Picker 
                    data={data_picker}
                    title="请选择"
                    cascade={false}
                    value={this.state.sValue}
                    onChange={v => this.setState({ sValue: v })}
                    onOk={v => this.setState({ sValue: v })}
                >
                    <div className="item">Picker</div>
                </Picker>
                <div className="item">
                    Switch
                    <div className="fr">
                        <Switch
                            checked={this.state.checked}
                            onChange={() => {
                                this.setState({
                                    checked: !this.state.checked,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="item">
                    SwitchSmall
                    <div className="fr switch_small">
                        <Switch
                            checked={this.state.checked}
                            onChange={() => {
                                this.setState({
                                    checked: !this.state.checked,
                                });
                            }}
                        />
                    </div>
                </div>
                <Link to="/demo?type=search"><div className="item">SearchBar</div></Link>
                <Link to="/demo?type=carousel"><div className="item">Carousel</div></Link>
                <Link to="/demo?type=grid"><div className="item">Grid</div></Link>
                <Link to="/demo?type=textarea"><div className="item">TextareaItem</div></Link>
                <Link to="/demo?type=imagepicker"><div className="item">ImagePicker</div></Link>
                <div onClick={this.showModal('showModal')} className="item">Modal</div>
                <div className="item" onClick={() => prompt('标题', '请填写正确的邮箱地址',
                    [
                        { text: '取消', },
                        {
                            text: '确定',
                            onPress: value => console.log(value) 
                        },
                    ], 'default', null, ['请填写邮箱地址'])}
                >Modal(With Input)</div>
                <Modal
                    visible={this.state.showModal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose}
                    title="提示"
                    footer={[
                        { text: '取消', onPress: () => { this.onClose('showModal')(); } },
                        { text: '确定', onPress: () => { console.log('ok');this.onClose('showModal')(); } }
                    ]}
                >
                    <div className="modal_inder_wrap">
                        这里是自定义内容及其样式区域
                    </div>
                </Modal>
            </div>
        )
    }
}
export class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef(); //新的获取节点方式，同时支持新方法获取子组件ref
        this.state = {
            helloText: null
        };
    }

    componentDidMount() {
        this.props.history.push('/hello/ws');
        this.props.helloList.call(this);
        this.props.getHelloList.call(this);
    }

    // componentWillReceiveProps(newProps) { 即将废弃
        
    // }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.helloText !== prevState.helloText) {
            return {
                helloText: nextProps.helloText,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.helloText !== prevProps.helloText) {
            // do some network requests
        }
    }

    onTabChange = (e) => {
        const index = e.nativeEvent.selectedSegmentIndex;
        console.log(index,e.nativeEvent.value)
        if (index === 1) {
            this.props.history.push('/hello/ant');
        } else {
            this.props.history.push('/hello/ws');
        }
    }

    onTabbarChange = (e) => {
        console.log(e.nativeEvent.selectedSegmentIndex,e.nativeEvent.value)
    }

    render() {
        if (false) { // 如果网络错误抛出异常，统一处理
            throw new Error("Some Err Measage!");
        }
        return (
            <div ref={this.myRef} style={{height: window.innerHeight}}>
                {/* <div className="title">现有组件</div> */}
                <Tab values={['现有组件', '蚂蚁金服']} selectedIndex={(this.props.location.pathname.split('/').slice(-1)[0]=='ant')?1:0} onChange={this.onTabChange} />
                <WhiteSpace />
                <Route path={`/hello/ws`} exact={true} component={WsComponent} />
                <Route path={`/hello/ant`} exact={true} component={AntComponent} />
                {/* <div className="title">Ant Design Mobile</div> */}
                <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                    <TabBar onChange={this.onTabbarChange} values={value_tabbar} />
                </div>
            </div>
        );
    }
}
HomeView.propTypes = {
    // schcode: PropTypes.string.isRequired,
    // loginFailed: PropTypes.bool.isRequired,
    // userInfo: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
    const {helloText, helloValue} = state.hello;
    return {
        helloText,
        helloValue
    };
};
export default connect((mapStateToProps), {
    helloList, 
    getHelloList
})(HomeView);
