import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {capitalize, timestampToDate} from '../utils/helper'
import {listCategories, getPosts} from '../actions'

const styles = {
    chip: {
        margin: 4,
        textAlign: 'center',
        cursor: 'pointer'
    },
    chipWrapper: {
        display: 'inline-block',
        float: 'left',
        color: "#666666"
    },
    cards: {
        margin: 10,
        maxHeight: 400,
        overflowY: 'scroll'
    },
    card: {
        marginBottom: 5
    },
    selectStyles: {
        width: 150,
        display: 'inline-block',
        float: 'right'
    }
};

class HomePage extends Component {
    state = {
        isLoading: false,
        selectValue: 1
    }

    static propTypes = {
        categories: PropTypes.array.isRequired,
        posts: PropTypes.array.isRequired,
        getAllPosts: PropTypes.func.isRequired,
        list: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.listAllCategories()
        this.getAllPosts()
    }

    listAllCategories = () => {
        this.props.list()
    }
    getAllPosts = () => {
        this.props.getAllPosts()
    }

    handleClick = () => {
        console.log("Category selected")
    }

    handleChange = (event, index, selectValue) => {
        this.setState({selectValue});
    }

    render() {
        const {categories, posts} = this.props

        const categoriesList = categories.map((category, index) => {
            return (
                <Link to={`${category.path}/posts`} style={styles.chipWrapper} key={index}>
                    <Chip style={styles.chip} onClick={this.handleClick}>
                        {capitalize(category.name)}
                    </Chip>
                </Link>
            )
        })

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

        const allPostsList = sortedPosts.map((post) => {
            return (
                <Card style={styles.card} key={post.id}>
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
                        <Link to={`${post.category}/posts/${post.id}`}>
                            <FlatButton label="View" />
                        </Link>
                    </CardActions>
                </Card>
            )
        })
        return (
            <div className="container-fluid">
                <div className="full-width">
                    {categoriesList}
                </div>
                <br/>
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
                <hr/>
                <div style={styles.cards}>
                    {allPostsList}
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        list: () => dispatch(listCategories()),
        getAllPosts: () => dispatch(getPosts()),
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categoryReducer.categories,
        posts: state.postsReducer.posts
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)