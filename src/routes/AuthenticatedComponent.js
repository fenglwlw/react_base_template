import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userInfo, getUserInfo } from 'reduxdir/modules/userInfo';
import strings from 'strings';
import ErrorView from 'components/ErrorView';
import { setStorage } from 'routes/helper';
export function requireAuthentication(Component) {

    if (Component.AuthenticatedComponent) {
        return Component.AuthenticatedComponent
    }

    class AuthenticatedComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                login: 0,
                hasError: false
            }
        }

        componentDidMount() {
            if (this.props.loginFailed && this.props.stucode.length === 0) {
                setStorage('login', false);
                this.props.userInfo.call(this);
                this.props.getUserInfo.call(this);
            } else {
                this.setState({
                    login: 1
                });
                setStorage('login', true);
            }
        }

        
        componentDidCatch(error, info) {
            this.setState({hasError: true})
            console.log(error, info)
        }

        componentWillReceiveProps(newProps) {
            if (newProps.username !== this.props.username && newProps.username !== strings.NOT_LOGIN) {
                if (newProps.loginFailed) {
                    if (newProps.username === strings.NET_ERROR) {
                        this.setState({
                            login: -1
                        });
                    } else {
                        this.setState({
                            login: -2
                        });
                        alert(strings.NOT_LOGIN_MSG);
                    }
                    setStorage('login', false);
                } else {
                    this.setState({
                        login: 1
                    });
                    setStorage('login', true);
                }
            }
        }

        render() {
            if (this.state.hasError) {
                return <ErrorView height={window.innerHeight} />;
            }
            return (
                <div>
                    {this.state.login === 1 && <Component {...this.props} />}
                    {this.state.login === -1 && <ErrorView height={window.innerHeight} />}
                    {this.state.login === -2 && <ErrorView text={strings.NOT_LOGIN_MSG} />}
                </div>
            )

        }
    }
    AuthenticatedComponent.propTypes = {
        schcode: PropTypes.string.isRequired,
        stucode: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        loginFailed: PropTypes.bool.isRequired,
        photo: PropTypes.string.isRequired,
        userInfo: PropTypes.func.isRequired,
        getUserInfo: PropTypes.func.isRequired
    };
    const mapStateToProps = (state) => {
        const {
            schcode,
            stucode,
            username,
            photo,
            failed,
            identity,
            pycc
        } = state.userInfo;
        return {
            schcode,
            stucode,
            username,
            photo,
            loginFailed: failed,
            identity,
            pycc
        };
    };


    Component.AuthenticatedComponent = connect(mapStateToProps, {
        userInfo,
        getUserInfo
    })(AuthenticatedComponent);
    return Component.AuthenticatedComponent;
}