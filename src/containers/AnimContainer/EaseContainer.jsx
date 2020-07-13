import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class EaseContainer extends React.Component {
    render() {
        const anim = this.props.appearAnim || false;
        const time = this.props.duration;
        return (
            <ReactCSSTransitionGroup transitionName='ease'
                transitionEnterTimeout={time}
                transitionLeaveTimeout={time}
                transitionAppear={anim}
                transitionAppearTimeout={time}>
                {this.props.content}
            </ReactCSSTransitionGroup>
        );
    }
}

EaseContainer.propTypes = {
    appearAnim: PropTypes.bool,
    duration: PropTypes.number.isRequired,
    content: PropTypes.element.isRequired
};

export default EaseContainer;