import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {timestampToDate} from '../utils/helper'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'

import {white, green500} from 'material-ui/styles/colors'

import {getPostsByCategory, createPost} from '../actions'
import {capitalize} from '../utils/helper'


const NoPostsYet = (props) => (
    <Card>
        <CardTitle
            title={`No posts yet in '${capitalize(props.category)}'. Create a post below.`}
        />
    </Card>
)

const styles = {
    card: {
        marginBottom: 5
    },
    selectStyles: {
        width: 150,
        display: 'inline-block',
        float: 'right'
    },
    formStyles: {
        width: '50%',
        display: 'block',
        margin: '0 auto'
    },
    paperStyles: {
        height: 'auto',
        width: '100%',
        textAlign: 'center',
        display: 'inline-block',
        padding: 20
    }
}

class Category extends Component {
    static propTypes = {
        getPostsByCategory: PropTypes.func.isRequired,
        posts: PropTypes.array.isRequired,
        post: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            title: '',
            author: '',
            body: '',
            selectValue: 1,
            buttonDisabled: false
        }
    }

    componentDidMount() {
        const {match} = this.props
        console.log("ABC", match.params)
        this.props.getPostsByCategory(match.params.category)
    }

    handleChange = (event, index, selectValue) => {
        this.setState({selectValue});
    }

    handleValueChange = (parameter) => {
        return (e) => {
            const state = {}
            state[parameter] = e.target.value
            this.setState(state)
        }
    }

    handlePost = () => {
        this.setState({
            buttonDisabled: true
        }, () => {
            window.setTimeout(this.setState({
                buttonDisabled: false,
                author: '',
                title: '',
                body: ''
            }), 1000)
        })

        if (this.state.title.trim().length !== 0 && this.state.body.trim().length !== 0 && this.state.author.trim().length !== 0) {
            this.props.post(this.state.title, this.state.body, this.state.author, this.props.match.params.category)
        }
    }

    render() {
        const {posts, match} = this.props

        let sortedPosts = [];
        switch (this.state.selectValue) {
            case 1:
                sortedPosts = _.orderBy(posts, ['voteScore'], ['desc'])
                break;
            case 2:
                sortedPosts = _.orderBy(posts, ['timestamp'], ['desc'])
                break;
            default:
                sortedPosts = posts;
                break;
        }

        const voteScoreAvatar = (voteScore) => {
            return (
                <Avatar>
                    {voteScore}
                </Avatar>
            )
        }

        const allPostsList = sortedPosts.map((post, index) => {
            return (
                <Card style={styles.card} key={index}>
                    <CardHeader
                        title={post.title}
                        subtitle={`on ${timestampToDate(post.timestamp)}`}
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar={voteScoreAvatar(post.voteScore)}
                    />
                    <CardTitle title={`posted in ${post.category}`} subtitle={`by ${post.author}`} expandable={true} />
                    <CardText expandable={true}>{post.body}</CardText>
                    <CardActions expandable={true} style={{textAlign: 'right'}}>
                        <Link to={`posts/${post.id}`}>
                            <FlatButton label="View" />
                        </Link>
                    </CardActions>
                </Card>
            )
        })

        return (
            <div className="container-fluid">
                <h3 style={{width: '50%', display: 'inline-block'}}>
                    All Posts
                </h3>
                <SelectField
                    floatingLabelText="Sort By"
                    style={styles.selectStyles}
                    value={this.state.selectValue}
                    onChange={this.handleChange}
                >
                    <MenuItem value={1} primaryText="Vote Score" />
                    <MenuItem value={2} primaryText="Date" />
                </SelectField>
                <div className="post-details">
                    {(allPostsList.length>0)?allPostsList:<NoPostsYet category={match.params.category}/>}
                </div>
                <hr/>
                <div style={styles.formStyles}>
                    <Paper style={styles.paperStyles} zDepth={2} rounded={false}>
                        <h3>Create Post</h3>
                        <TextField
                            fullWidth={true}
                            hintText="Title"
                            onChange={this.handleValueChange('title')}
                            value={this.state.title}
                        />
                        <TextField
                            fullWidth={true}
                            hintText="Author"
                            onChange={this.handleValueChange('author')}
                            value={this.state.author}
                        />
                        <TextField
                            fullWidth={true}
                            hintText="Content"
                            multiLine={true}
                            rows={2}
                            onChange={this.handleValueChange('body')}
                            value={this.state.body}
                        />
                        <RaisedButton
                            label="Add"
                            fullWidth={true}
                            backgroundColor={green500}
                            labelColor={white}
                            onClick={this.handlePost}
                            disabled={this.state.buttonDisabled}
                        />
                    </Paper>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        posts: state.postsReducer.posts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPostsByCategory: (data) => dispatch(getPostsByCategory(data)),
        post: (title, body, author, category) => dispatch(createPost(title, body, author, category))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Category)