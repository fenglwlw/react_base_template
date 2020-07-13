import React from 'react';
import PropTypes from 'prop-types';

export default class Profile extends React.Component {
    // static propTypes = {
    //     name: PropTypes.string.isRequired,
    //     image: PropTypes.string
    // };

    render() {
        const icon = this.props.image && this.props.image.length > 0 ? { backgroundImage: `url(${this.props.image})` } : null;
        return (
            <header className='user'>
                <div className='user_face' style={icon} />
                <p className='welcome'>{this.props.name}</p>
            </header>
        );
    }
}