import React from 'react';
import PropTypes from 'prop-types';
import strings from 'strings';
export default class LoadingFooter extends React.Component {
    render() {
        const { hasMore, loading } = this.props;
        let css = {
            color: '#999',
            lineHeight: '44px',
            textAlign: 'center'
        }
        let indicator = '上拉加载更多';
        if (hasMore) {
            if (loading) {
                indicator = <span style={{display: 'inline-block'}}>{strings.LOADING}</span>;
            }
        } else {
            indicator = '没有更多了';
        }
        return <div style={css}>{ indicator }</div>;
    }
}
LoadingFooter.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
};