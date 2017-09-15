import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import _ from 'lodash'

import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card'

import Avatar from 'material-ui/Avatar'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog'

import IconButton from 'material-ui/IconButton'
import UpVoteButton from 'material-ui/svg-icons/action/thumb-up'
import DownVoteButton from 'material-ui/svg-icons/action/thumb-down'
import DeleteButton from 'material-ui/svg-icons/action/delete'
import EditButton from 'material-ui/svg-icons/image/edit'

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'

import {white, grey300, red500, green500} from 'material-ui/styles/colors'

import CommentDetails from './Comment'

import {timestampToDate} from '../utils/helper'
import {
    getPostDetails,
    getPostComments,
    postComment,
    votePost,
    editPost,
    deletePost
} from '../actions'

const styles = {
    voteScoreAvatar: {
        margin: 5,
        verticalAlign: 'super'
    },
    votingActions: {
        textAlign: 'left',
        display: 'block',
        float: 'left'
    },
    buttonActions: {
        marginRight: 0,
        padding: 0
    },
    postActions: {
        textAlign: 'right',
        display: 'block'
    },
    modalActions: {
        marginRight: 10
    },
    createCommentAction: {
        marginLeft: 10,
        marginRight: 10,
    },
    commentsListStyles: {
        maxHeight: 400,
        overflowY: 'scroll'
    },
    paperStyles: {
        height: 'auto',
        width: '100%',
        textAlign: 'center',
        display: 'inline-block',
        padding: 20
    },
    formStyles: {
        width: '50%',
        display: 'block',
        margin: '0 auto'
    },
    selectStyles: {
        width: 150,
        display: 'inline-block',
        float: 'right'
    }
};

class Post extends Component {
    static propTypes = {
        details: PropTypes.object.isRequired,
        comments: PropTypes.array.isRequired,
        getDetails: PropTypes.func.isRequired,
        getComments: PropTypes.func.isRequired,
        postComment: PropTypes.func.isRequired,
        votePost: PropTypes.func.isRequired,
        editPost: PropTypes.func.isRequired,
        deletePost: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            author: '',
            body: '',
            buttonDisabled: false,
            showEditDialog: false,
            showDeleteDialog: false,
            showCommentDialog: false,
            newPostBody: '',
            newPostTitle: '',
            editSubmitButtonDisabled: false,
            selectedComment: {},
            selectValue: 1
        }
    }

    componentDidMount() {
        const {match} = this.props
        this.props.getDetails(match.params.post_id)
        this.props.getComments(match.params.post_id)
        this.setState({id: match.params.post_id})
    }

    updateVote = (id, vote) => {
        this.props.votePost(id, vote)
    }

    openDeletePostModal = (details) => {
        this.setState({
            showDeleteDialog: true
        })
    }

    handleDelete = () => {
        const {id} = this.state
        this.props.deletePost(id)
    }

    editPost=(details)=>{
        this.setState({
            showEditDialog:true,
            newPostTitle:details.title,
            newPostBody:details.body
        })
    }
    handleEdit=()=>{
        const {id,newPostBody,newPostTitle}=this.state
        this.props.editPost(id,newPostTitle,newPostBody)
        this.setState({
            showEditDialog:false
        })
    }

    viewComment = (comment) => {
        console.log(comment)
        this.setState({
            selectedComment: comment
        }, () => {
            this.setState({
                showCommentDialog: true
            })
        })
    }

    handleValueChange = (parameter) => {
        return (e) => {
            const state = {}
            state[parameter] = e.target.value
            this.setState(state)
        }
    }

    handleComment = () => {
        this.setState({
            buttonDisabled: true
        }, () => {
            window.setTimeout(this.setState({
                buttonDisabled: false,
                body: '',
                author: ''
            }), 1000)
        })
        const {match} = this.props

        if (this.state.body.trim().length !== 0 && this.state.author.trim().length !== 0) {
            this.props.postComment(match.params.post_id, this.state.body, this.state.author)
        }
    }

    handleChange = (event, index, selectValue) => {
        this.setState({selectValue});
    }

    render() {
        const {comments, details} = this.props

        let sortedComments = [];
        switch (this.state.selectValue) {
            case 1:
                sortedComments = _.orderBy(comments, ['voteScore'], ['desc'])
                break;
            case 2:
                sortedComments = _.orderBy(comments, ['timestamp'], ['desc'])
                break;
            default:
                sortedComments = comments;
                break;
        }

        const voteScoreAvatar = (voteScore) => {
            return (
                <Avatar>
                    {voteScore}
                </Avatar>
            )
        }

        const postComments = sortedComments.map((comment) => {
            return (
                <div key={comment.id}>
                    <ListItem
                        leftAvatar={voteScoreAvatar(comment.voteScore)}
                        primaryText={comment.body}
                        secondaryText={`${comment.author} commented on ${timestampToDate(comment.timestamp)}`}
                        onClick={() => {
                            this.viewComment(comment)
                        }}
                    />
                </div>
            )
        });

        const deletePostActions = [
            <RaisedButton
                label="Cancel"
                onClick={() => {
                    this.setState({showDeleteDialog: false})
                }}
                style={styles.modalActions}
            />,
            <RaisedButton
                label="Delete"
                backgroundColor={red500}
                labelColor={white}
                onClick={() => {
                    this.handleDelete()
                    this.setState({showDeleteDialog: false})
                }}
                style={styles.modalActions}
            />
        ]

        return (
            <div className="container-fluid">
                {(Object.keys(details).length > 1) ?
                    <div>
                        <div className="post-details">
                            <Card>
                                <CardHeader
                                    title={details.title}
                                    subtitle={`on ${timestampToDate(details.timestamp)}`}
                                />
                                <CardTitle title={`posted in ${details.category}`} subtitle={`by ${details.author}`}/>
                                <CardText>{details.body}</CardText>
                                <CardActions style={styles.votingActions}>
                                    <Avatar
                                        color={white}
                                        backgroundColor={grey300}
                                        size={30}
                                        style={styles.voteScoreAvatar}
                                    >
                                        {details.voteScore}
                                    </Avatar>
                                    <IconButton
                                        onClick={() => {
                                            this.updateVote(details.id, 'upVote')
                                        }}
                                        tooltip="Up Vote post"
                                        style={styles.buttonActions}>
                                        <UpVoteButton/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            this.updateVote(details.id, 'downVote')
                                        }}
                                        tooltip="Down Vote post"
                                        style={styles.buttonActions}>
                                        <DownVoteButton/>
                                    </IconButton>
                                </CardActions>
                                <CardActions style={styles.postActions}>
                                    <IconButton
                                        onClick={() => {
                                            (this.editPost(details))
                                        }}
                                        tooltip="Edit Post"
                                        style={styles.buttonActions}>
                                        <EditButton/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            (this.openDeletePostModal(details))
                                        }}
                                        tooltip="Delete Post"
                                        style={styles.buttonActions}>
                                        <DeleteButton color={red500}/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <h3 style={{width: '50%', display: 'inline-block'}}>Comments({postComments.length})</h3>
                            <SelectField
                                floatingLabelText="Sort By"
                                style={styles.selectStyles}
                                value={this.state.selectValue}
                                onChange={this.handleChange}
                            >
                                <MenuItem value={1} primaryText="Vote Score" />
                                <MenuItem value={2} primaryText="Date" />
                            </SelectField>
                            <hr/>
                            <List style={styles.commentsListStyles}>
                                {postComments}
                            </List>
                            <hr/>
                            <div style={styles.formStyles}>
                                <Paper style={styles.paperStyles} zDepth={2} rounded={false}>
                                    <h3>Add a Comment</h3>
                                    <TextField
                                        fullWidth={true}
                                        hintText="Name"
                                        onChange={this.handleValueChange('author')}
                                        value={this.state.author}
                                    />
                                    <TextField
                                        fullWidth={true}
                                        hintText="Comment"
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
                                        onClick={this.handleComment}
                                        disabled={this.state.buttonDisabled}
                                    />
                                </Paper>
                            </div>
                        </div>
                        <Dialog
                            actions={deletePostActions}
                            title={`Delete "${details.title}"?`}
                            modal={true}
                            open={this.state.showDeleteDialog}
                            onRequestClose={() => {
                                this.setState({showDeleteDialog: false})
                            }}
                        >

                        </Dialog>

                        <Dialog
                            title={`Editing ${details.title}`}
                            actions={[
                                <RaisedButton
                                    label='Cancel'
                                    style={styles.modalActions}
                                    onClick={()=>{this.setState({showEditDialog:false})}}
                                />,
                                <RaisedButton
                                    label='Submit'
                                    style={styles.modalActions}
                                    primary={true}
                                    onClick={()=>{this.handleEdit()}}
                                    disabled={this.state.editSubmitButtonDisabled}
                                />
                            ]}
                            open={this.state.showEditDialog}
                            onRequestClose={()=>{this.setState({showEditDialog:false})}}
                        >
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Title"
                                value={this.state.newPostTitle}
                                onChange={this.handleValueChange('newPostTitle')}
                            />
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Body"
                                value={this.state.newPostBody}
                                onChange={this.handleValueChange('newPostBody')}
                                multiLine={true}
                            />
                        </Dialog>

                        <CommentDetails
                            commentOpen={this.state.showCommentDialog}
                            close={()=>{this.setState({showCommentDialog:false})}}
                            comment={this.state.selectedComment}
                        />
                    </div>
                    :
                    <div>
                        Post not found! <Link to="/">Go to homepage</Link>
                    </div>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        details: state.postDetailsReducer.details,
        comments: state.commentsReducer.comments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getDetails: (id) => dispatch(getPostDetails(id)),
        getComments: (id) => dispatch(getPostComments(id)),
        postComment: (id, body, author) => dispatch(postComment(id, body, author)),
        votePost: (id, vote) => dispatch(votePost(id, vote)),
        editPost: (id, title, body) => dispatch(editPost(id, title, body)),
        deletePost: (id) => dispatch(deletePost(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)