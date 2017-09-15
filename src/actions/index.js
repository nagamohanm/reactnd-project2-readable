import * as API from '../utils/api'

const LIST_CATEGORIES = 'LIST_CATEGORIES'

function listCategories() {
    return function (dispatch) {
        API.getCategories().then((data) => {
            dispatch({
                type: LIST_CATEGORIES,
                data: data.categories
            })
        })
    }
}

const GET_ALL_POSTS = 'GET_ALL_POSTS'

function getPosts() {
    return function (dispatch) {
        API.getPosts().then((data) => {
            dispatch({
                type: GET_ALL_POSTS,
                data
            })
        })
    }
}

const GET_POSTS_BY_CATEGORY = 'GET_POSTS_BY_CATEGORY'

function getPostsByCategory(category) {
    return function (dispatch) {
        API.getPostsByCategory(category).then((data) => {
            dispatch({
                type: GET_POSTS_BY_CATEGORY,
                data
            })
        })
    }
}

const GET_POST_DETAILS = 'GET_POST_DETAILS'

function getPostDetails(id) {
    return function (dispatch) {
        API.getPost(id).then((data) => {
            dispatch({
                type: GET_POST_DETAILS,
                data
            })
        })
    }
}

const GET_POST_COMMENTS = 'GET_POST_COMMENTS'

function getPostComments(id) {
    return function (dispatch) {
        API.getComments(id).then((data) => {
            dispatch({
                type: GET_POST_COMMENTS,
                data
            })
        })
    }
}

const CREATE_POST = 'CREATE_POST'

function createPost(title, body, author, category) {
    return function (dispatch) {
        API.createPost({
            title,
            body,
            author,
            category
        }).then((data) => {
            dispatch({
                type: CREATE_POST,
                data
            })
        })
    }
}

const EDIT_POST = 'EDIT_POST'

function editPost(id, title, body) {
    return function (dispatch) {
        API.editPost({id, title, body}).then((data) => {
            dispatch({
                type: EDIT_POST,
                data
            })
        })
    }

}

const DELETE_POST = 'DELETE_POST'

function deletePost(id) {
    return function (dispatch) {
        API.deletePost(id).then((data) => {
            console.log(data)
            dispatch({
                type: DELETE_POST,
                data: id
            })
        }).catch((err) => {
            console.log(err)
            dispatch({
                type: DELETE_POST,
                data: id
            })
        })
    }
}

const UPDATE_POST_VOTE = 'UPDATE_POST_VOTE'

function votePost(id, vote) {
    return function (dispatch) {
        API.votePost(id, vote).then((data) => {
            console.log(data);
            dispatch({
                type: UPDATE_POST_VOTE,
                data
            })
        })
    }
}

const CREATE_COMMENT = 'CREATE_COMMENT'

function postComment(id, body, author) {
    return function (dispatch) {
        API.createComment({
            parentId: id,
            body,
            author
        }).then((data) => {
            dispatch({
                type: CREATE_COMMENT,
                data
            })
        })
    }
}

const EDIT_COMMENT = 'EDIT_COMMENT'

function editComment(id, body) {
    return function (dispatch) {
        API.editComment(id, body).then((data) => {
            dispatch({
                type: EDIT_COMMENT,
                data
            })
        })
    }
}

const DELETE_COMMENT = 'DELETE_COMMENT'

function deleteComment(id) {
    return function (dispatch) {
        API.deleteComment(id).then((data) => {
            console.log(data)
            dispatch({
                type: DELETE_COMMENT,
                data: id
            })
        }).catch((err) => {
            console.log(err)
            dispatch({
                type: DELETE_COMMENT,
                data: id
            })
        })
    }
}

const GET_COMMENT_DETAILS = 'GET_COMMENT_DETAILS'

function getCommentDetails(id) {
    return function (dispatch) {
        API.getComment(id).then((data) => {
            dispatch({
                type: GET_COMMENT_DETAILS,
                data
            })
        })
    }
}

const UPDATE_COMMENT_VOTE = 'UPDATE_COMMENT_VOTE'

function voteComment(id, vote) {
    return function (dispatch) {
        API.voteComment(id, vote).then((data) => {
            console.log(data);
            dispatch({
                type: UPDATE_COMMENT_VOTE,
                data
            })
        })
    }
}

export {
    LIST_CATEGORIES,
    GET_ALL_POSTS,
    GET_POST_DETAILS,
    CREATE_POST,
    EDIT_POST,
    DELETE_POST,
    UPDATE_POST_VOTE,
    GET_POST_COMMENTS,
    CREATE_COMMENT,
    EDIT_COMMENT,
    DELETE_COMMENT,
    GET_COMMENT_DETAILS,
    UPDATE_COMMENT_VOTE,
    GET_POSTS_BY_CATEGORY,
    listCategories,
    getPosts,
    getPostDetails,
    getPostComments,
    createPost,
    editPost,
    deletePost,
    votePost,
    postComment,
    editComment,
    deleteComment,
    getCommentDetails,
    voteComment,
    getPostsByCategory,
}