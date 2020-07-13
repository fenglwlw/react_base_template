import React from 'react';
import BackButton from './BackButton';
import PropTypes from 'prop-types';
type Props = {
    title: string
};

export default class ActionBar extends React.Component < void, Props, void > {
    static propTypes = {
        title: PropTypes.string
    };

    render() {
        return (
            <div className='ws_actionbar_container'>
                <BackButton />
                <div className='ws_actionbar_title'>{this.props.title}</div>
        </div>
        );
    }
}