import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import CommunicationIcon from 'material-ui/svg-icons/communication/comment'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import {white} from 'material-ui/styles/colors'

import HomePage from './components/HomePage'
import Post from './components/Post'
import Category from './components/Category'

class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <AppBar
                        title={<Link to="/" style={{color: white, textDecoration: 'none'}}>Udacity Readable</Link>}
                        iconElementLeft={<IconButton><CommunicationIcon/></IconButton>}
                    />
                    <Route exact path="/" component={HomePage}/>
                    <Route
                        exact path="/:category/posts/:post_id"
                        component={Post}
                    />
                    <Route
                        exact path="/:category/posts"
                        component={Category}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default (App);