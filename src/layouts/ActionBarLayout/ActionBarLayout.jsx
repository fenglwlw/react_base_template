/* @flow */
import React from 'react';
import ActionBar from '../../components/ActionBar';
import PropTypes from 'prop-types';
type Props = {
    title: string,
    children: React.Element
};

export default class ActionBarLayout extends React.Component < void, Props, void > {
    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <section>
                <ActionBar title={this.props.title}/>
                <div style={{ paddingTop: 30 }}>
                    {this.props.children}
                </div>
            </section>
        );
    }
}