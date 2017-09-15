import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import UpVoteButton from 'material-ui/svg-icons/action/thumb-up'
import DownVoteButton from 'material-ui/svg-icons/action/thumb-down'
import DeleteButton from 'material-ui/svg-icons/action/delete'
import CancelButton from 'material-ui/svg-icons/navigation/cancel'
import EditButton from 'material-ui/svg-icons/image/edit'
import {white, grey300, red500} from 'material-ui/styles/colors'
import {connect} from 'react-redux'
import {getCommentDetails, voteComment, editComment, deleteComment} from '../actions'
import {timestampToDate} from '../utils/helper'
import PropTypes from 'prop-types'

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
    }
}

class Comment extends React.Component {
    static propTypes = {
        commentOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
        comment: PropTypes.object.isRequired,
        commentDetails: PropTypes.object.isRequired,
        getDetails: PropTypes.func.isRequired,
        vote: PropTypes.func.isRequired,
        edit: PropTypes.func.isRequired,
        deleteComment: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            showEditDialog: false,
            editComment: ''
        }
    }

    componentWillReceiveProps() {
        if (this.props.comment.id !== this.props.commentDetails.id) {
            this.props.getDetails(this.props.comment.id)
            this.setState({
                editComment: this.props.comment.body
            })
        }
    }

    edit = () => {
        this.props.edit(this.props.commentDetails.id, this.state.editComment)
        this.setState({
            showEditDialog: false
        })
    }
    deleteComment = () => {
        this.props.deleteComment(this.props.commentDetails.id)
        this.props.close()
    }

    render() {
        console.log(this.props.comment)
        return (
            <div>
                <Dialog
                    open={this.props.commentOpen}
                    actions={
                        [
                            <div>
                                <div style={styles.votingActions}>
                                    <Avatar
                                        color={white}
                                        backgroundColor={grey300}
                                        size={30}
                                        style={styles.voteScoreAvatar}
                                    >
                                        {this.props.commentDetails.voteScore}
                                    </Avatar>
                                    <IconButton
                                        onClick={()=>{this.props.vote(this.props.commentDetails.id,'upVote')}}
                                        tooltip="Up Vote"
                                        style={styles.buttonActions}>
                                        <UpVoteButton/>
                                    </IconButton>
                                    <IconButton
                                        onClick={()=>{this.props.vote(this.props.commentDetails.id,'downVote')}}
                                        tooltip="Down Vote"
                                        style={styles.buttonActions}>
                                        <DownVoteButton/>
                                    </IconButton>
                                </div>
                                <div style={styles.postActions}>
                                    <IconButton
                                        tooltip="Close"
                                        onClick={this.props.close}
                                        style={styles.buttonActions}>
                                        <CancelButton/>
                                    </IconButton>
                                    <IconButton
                                        onClick={()=>{this.setState({showEditDialog:true})}}
                                        tooltip="Edit"
                                        style={styles.buttonActions}>
                                        <EditButton/>
                                    </IconButton>
                                    <IconButton
                                        onClick={this.deleteComment}
                                        tooltip="Delete"
                                        style={styles.buttonActions}>
                                        <DeleteButton color={red500}/>
                                    </IconButton>
                                </div>
                            </div>
                        ]
                    }
                    title={`${this.props.commentDetails.author} commented`}
                >
                    {this.props.commentDetails.body}
                    <br/>
                    {timestampToDate(this.props.commentDetails.timestamp)}
                </Dialog>

                <Dialog
                    open={this.state.showEditDialog}
                    title={`Edit ${this.props.commentDetails.author}'s comment`}
                    actions={
                        [
                            <RaisedButton
                                label="Close"
                                style={styles.modalActions}
                                onClick={() => {
                                    this.setState({showEditDialog: false})
                                }}
                            />,
                            <RaisedButton
                                label="Submit"
                                style={styles.modalActions}
                                onClick={this.edit}
                            />
                        ]
                    }
                >
                    <TextField
                        floatingLabelText="Comment"
                        fullWidth={true}
                        value={this.state.editComment}
                        onChange={(e) => {
                            this.setState({editComment: e.target.value})
                        }}
                    />
                </Dialog>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        commentDetails: state.commentDetailsReducer.details
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getDetails: (id) => dispatch(getCommentDetails(id)),
        vote: (id, value) => dispatch(voteComment(id, value)),
        edit: (id, body) => dispatch(editComment(id, body)),
        deleteComment: (id) => dispatch(deleteComment(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)