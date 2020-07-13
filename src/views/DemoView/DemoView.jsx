import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Profile from 'components/Profile';
import { Link, Route } from 'react-router-dom';
import { helloList, getHelloList } from 'reduxdir/modules/hello';
import strings from 'strings';
import ErrorView from 'components/ErrorView';
import EmptyView from 'components/EmptyView';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import WhistleToast from 'components/WhistleToast';
import { TextareaItem, SearchBar, ImagePicker, Carousel, Grid } from 'antd-mobile';
import demo from './demo.scss';
import {getQuery} from 'utils';
const data_grid = Array.from(new Array(9)).map(() => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
}));

const icon_arr = [ 'deletes', 'selected', 'unselect', 'no_select', 'single_select', 'one_message', 'red_dot', 'more_message', 'new_message', 'more', 'help', 'success', 'failed', 'waiting', 'caution' ]

export class DemoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            files: [],
            imgHeight: 'auto'
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        
    }

    contentChange = (e) => {
        if (e !== this.state.content) {
          let val = e;
          if(strings.RegStrEmoji.test(e)){
            val = e.replace(strings.RegStrEmoji,"");
          }
          this.setState({
            content: val,
          })
        }
    }

    onImgChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
    }

    render() {
        const {type} = this.props;
        let content = '';
        switch (type) {
            case 'err':
                content = <ErrorView height={window.innerHeight} />
            break;
            case 'empty':
                content = <EmptyView height={window.innerHeight} />
            break;
            case 'loading':
                content = <Loading show={true} />
            break;
            case 'toast': // type => success,failed,attention,toptips
                content = <WhistleToast type="success" text="提示文案" millisecond={200000} />
            break;
            case 'search':
                content = <SearchBar placeholder="搜索" />
            break;
            case 'icon':
                content = (
                    <div>
                        <ul className="clearfix" style={{padding: '15px'}}>
                            {
                                icon_arr.map((item, index) => {
                                    let judge = this.props.location.pathname.split('/').slice(-1)[0] == `icon_${item}`;
                                    return (
                                        <Link key={index} to={{pathname: `/demo/icon_${item}`, search: '?type=icon', state: {type: item}}}>
                                            <li className={judge?"icon-item active":"icon-item"}>{item}</li>
                                        </Link> 
                                    )
                                })
                            }
                        </ul>
                        {icon_arr.map((item, index) => {
                            return (
                                <div key={index}  style={{padding: '0 15px'}}><Route path={`/demo/icon_${item}`} render={props => <Icon type={item} />} /></div>
                            )
                        })}
                        
                    </div>
                )
            break;
            case 'carousel':
                content = <Carousel
                                autoplay={false}
                                infinite
                                beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                afterChange={index => console.log('slide to', index)}
                            >
                                {['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn'].map((val, index) => (
                                    <img
                                        src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                        key={index}
                                        style={{ width: '100%', verticalAlign: 'top', height: this.state.imgHeight}}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({ imgHeight: 'auto' });
                                        }}
                                    />
                                ))}
                            </Carousel>
            break;
            case 'grid':
                content = <Grid data={data_grid}
                            columnNum={3}
                            renderItem={(item, index) => (
                                <div style={{ padding: '12.5px' }}>
                                    <img src={item.icon} style={{ width: '60px', height: '60px' }} />
                                    <div style={{ color: '#505050', fontSize: '14px', marginTop: '1px' }}>
                                        <span>名称{index}</span>
                                    </div>
                                </div>
                            )}
                        />
            break;
            case 'textarea':
                content = <TextareaItem
                            placeholder="请输入您的描述"
                            rows={5}
                            count={100}
                            value={this.state.content}
                            onChange={this.contentChange}
                        />
            break;
            case 'imagepicker':
                content = (<div className="imagepicker">
                                <ImagePicker
                                    files={this.state.files}
                                    onChange={this.onImgChange}
                                    onImageClick={(index, fs) => console.log(index, fs)}
                                    selectable={this.state.files.length < 7}
                                />
                            </div>)
            break;
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const {helloText, helloValue} = state.hello;
    const {type} = getQuery(ownProps.location.search);
    return {
        helloText,
        helloValue,
        type
    };
};
export default connect((mapStateToProps), {
    helloList, 
    getHelloList
})(DemoView);
