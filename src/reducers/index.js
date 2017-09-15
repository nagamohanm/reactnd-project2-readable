import {
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
    GET_POSTS_BY_CATEGORY
} from "../actions";

import {combineReducers} from 'redux'

const initialCategoryState = {
    categories: []
}

function categoryReducer(state = initialCategoryState, action) {
    switch (action.type) {
        case LIST_CATEGORIES:
            console.log("From Category Reducer", action.data)
            return {...state, categories: action.data}
        default:
            return state;
    }
}

const initialPostsState = {
    posts: []
}

function postsReducer(state = initialPostsState, action) {
    console.log("From Posts Reducer - ");
    switch (action.type) {
        case GET_ALL_POSTS:
            console.log("Get all posts", action.data)
            return {
                ...state,
                posts: action.data
            }
        case CREATE_POST:
            console.log("Create a post", action.data)
            return {
                ...state,
                posts: [...state.posts, action.data]
            }
        case DELETE_POST:
            console.log("Delete a post")
            return {
                ...state,
                posts: [...state.posts.filter(post => post.id !== action.data)]
            }
        case GET_POSTS_BY_CATEGORY:
            console.log("Get posts by category", action.data)
            return {
                ...state,
                posts: action.data
            }
        default:
            return state;
    }
}

const initialPostDetailsState = {
    details: {}
}

function postDetailsReducer(state = initialPostDetailsState, action) {
    switch (action.type) {
        case GET_POST_DETAILS: {
            return {...state, details: action.data}
        }
        case UPDATE_POST_VOTE: {
            return {...state, details: action.data}
        }
        case EDIT_POST: {
            return {...state, details: action.data}
        }
        case DELETE_POST: {
            return {...state, details: {}}
        }
        default:
            return state;
    }
}

const initialCommentsState = {
    comments: []
}

function commentsReducer(state = initialCommentsState, action) {
    switch (action.type) {
        case GET_POST_COMMENTS: {
            return {...state, comments: action.data}
        }
        case CREATE_COMMENT: {
            return {...state, comments: [...state.comments, action.data]}
        }
        case EDIT_COMMENT: {
            return {
                ...state,
                comments: state.comments.filter(comment => comment.id !== action.data.id).concat(action.data)
            }
        }
        case DELETE_COMMENT: {
            return {...state, comments: state.comments.filter(comment => comment.id !== action.data)}
        }
        default: {
            return state
        }
    }
}

const initialCommentDetailsState = {
    details: {}
}

function commentDetailsReducer(state=initialCommentDetailsState, action) {
    switch (action.type){
        case GET_COMMENT_DETAILS:{
            return {...state,details:action.data}
        }
        case UPDATE_COMMENT_VOTE:{
            return {...state,details:action.data}
        }
        case EDIT_COMMENT:{
            return {...state,details:action.data}
        }
        default:{
            return state
        }
    }
}

export default combineReducers({
    categoryReducer,
    postsReducer,
    postDetailsReducer,
    commentsReducer,
    commentDetailsReducer
})