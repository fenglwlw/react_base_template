import React from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import './Scroll.scss';
class Scroll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pullupText: '上拉加载更多',
			pulldownText: '下拉刷新',
			pulldownStatus: false,
			pullupStatus: false
		}
	}
	componentDidMount() {
		setTimeout(() => {
			this._initScroll()
		}, 20)
	}
	componentWillReceiveProps(newProps) {
		if(newProps.data !== this.props.data) {
			setTimeout(() => {
				this.refresh();
			}, this.props.refreshDelay)
		}
	}
	_initScroll() {
		if (!this.refs.wrapper) {
			return;
		}
		this.scroll = new BScroll(this.refs.wrapper, {
			probeType: this.props.probeType,
			click: this.props.click
		})

		if (this.props.listenScroll || this.pulldown || this.props.pullup) {
			let me = this;
			this.scroll.on('scroll', (pos) => {
				if(me.props.listenScroll) {
					me.props.scroll(pos);
				}
			})
		}
		// 上拉加载
		if (this.props.pullup) {
			let me = this;
			this.scroll.on('scrollEnd', () => {
				if (me.scroll.y < (me.scroll.maxScrollY + 50)) {
					me.props.scrollToEnd();
				}
			})
		}
		// 下拉刷新
		if(this.props.pulldown) {
			let me = this;
			this.scroll.on('touchEnd', (pos) => {
				if(me.scroll.y > 50) {
					me.props.pulldownFn();
				}
			})
		}
		if (this.props.beforeScroll) {
			let me = this;
			this.scroll.on('beforeScrollStart', () => {
				// this.$emit('beforeScroll')
				me.props.beforeScroll();
			})
		}
	}
	disable() {
		this.scroll && this.scroll.disable()
	}
	enable() {
		this.scroll && this.scroll.enable()
	}
	refresh() {
		this.scroll && this.scroll.refresh()
	}
	scrollTo() {
		this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
	}
	scrollToElement() {
		this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
	}
	render() {
		return (
			<div ref="wrapper" className="list-wrapper">
				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
}
Scroll.defaultProps = {
	probeType: 1,
	click: true,
	listenScroll: false,
	pullup: false,
	beforeScroll: false,
	refreshDelay: 20
}
Scroll.propTypes = {
	probeType: PropTypes.number,
	click:  PropTypes.bool,
	listenScroll:  PropTypes.bool,
	pullup:  PropTypes.bool,
	beforeScroll:  PropTypes.bool,
	refreshDelay: PropTypes.number
}
export default Scroll;