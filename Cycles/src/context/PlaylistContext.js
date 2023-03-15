import React, {useEffect, useContext, useState} from 'react';
import context from './context';
import {BASEURL} from '../utils/api/url';
import RNSInfo from 'react-native-sensitive-info';
import {ngrokURL} from './AuthContext';
import axios from 'axios';
import envs from '../../Config/env';

const BACKEND_URL = envs.DEV_URL;

const defaultValue = {
  // avi_pic: null,
  // date: null,
  // description: null,
  // images: null,
  // location: null,
  // playlist_ApiURL: null,
  // playlist_cover: null,
  // playlist_title: null,
  // playlist_tracks: null,
  // playlist_type: null,
  // playlist_uri: null,
  // playlist_url: null,
  // user_id: null,
  // username: null,
  // track_cover: null,
  // track_artist: null,
  // track_album: null,
  // track_title: null,
  // track_url: null,
  // track_uri: null,
  // spotifyAuth: 'false',
  // isLiked: 'false',
  // isSelected: 'false',
  // selectedSpotifyPlaylist: [],
  userProfileData: [],
  userPlaylistData: [],
  myProfileData: [],
  myPlaylistData: [],
  allPlaylists: [],
  followingPlaylists: [],
  playlistDetails: [],
  playlistTracks: [],
  comments: [],
  spotifyPlaylists: [],
  errorMessage: '',
};

const playlistReducer = (state, action) => {
  switch (action.type) {
    case 'error_1':
      return {
        ...state,
        errorMessage: action.payload,
      };
    case 'clear_error_message':
      return {
        ...state,
        errorMessage: '',
      };
    case 'spotifyAuth':
      return {
        ...state,
        spotifyAuth: action.spotifyAuth,
      };
    case 'userProfileData':
      return {
        ...state,
        userProfileData: action.userProfileData,
      };
    case 'userPlaylistData':
      return {
        ...state,
        userPlaylistData: action.userPlaylistData,
      };
    case 'myProfileData':
      return {
        ...state,
        myProfileData: action.myProfileData,
      };
    case 'myPlaylistData':
      return {
        ...state,
        myPlaylistData: action.myPlaylistData,
      };
    case 'getAllPLaylists':
      return {
        ...state,
        allPlaylists: action.allPlaylists,
      };
    case 'followingPlaylists':
      return {
        ...state,
        followingPlaylists: action.followingPlaylists,
      };
    case 'playlistDetails':
      return {
        ...state,
        // avi_pic: action.avi_pic,
        // date: action.date,
        // description: action.description,
        // images: action.images,
        // location: action.location,
        // playlist_ApiURL: action.playlist_ApiURL,
        // playlist_cover: action.playlist_cover,
        // playlist_title: action.playlist_title,
        // playlist_tracks: action.playlist_tracks,
        // playlist_type: action.playlist_type,
        // playlist_uri: action.playlist_uri,
        // playlist_url: action.playlist_url,
        // user_id: action.user_id,
        // username: action.username,
        // track_cover: action.track_cover,
        // track_artist: action.track_artist,
        // track_album: action.track_album,
        // track_title: action.track_title,
        // track_url: action.track_url,
        // track_uri: action.track_uri,
        playlist: action.playlist,
      };
    case 'playlistTracks':
      return {
        ...state,
        tracks: action.tracks,
      };
    case 'comments':
      return {
        ...state,
        comments: action.comments,
      };
    case 'POST_COMMENT': {
      return {...state, comments: [action.payload, ...state.comments]};
    }
    case 'DELETE_COMMENT': {
      const newComments = state.comments.filter(
        comment => comment.id !== action.payload,
      );
      return {...state, comments: newComments};
    }
    case 'isLiked':
      return {
        ...state,
        isLiked: action.isLiked,
      };
    case 'spotifyPlaylists':
      return {
        ...state,
        spotifyPlaylists: action.spotifyPlaylists,
      };
    case 'selectedSpotifyPlaylist':
      return {
        ...state,
        selectedSpotifyPlaylist: action.selectedSpotifyPlaylist,
      };
    case 'isSelected':
      return {
        ...state,
        isSelected: action.isSelected,
      };
    default:
      return state;
  }
};

//Fetch current users profile data
const getMyProfileData = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  const userID = await RNSInfo.getItem('user_id', {});
  try {
    await axios
      .get(`${BACKEND_URL}/users/user/` + userID + '/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        dispatch({
          type: 'myProfileData',
          myProfileData: res.data,
        });
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

//Fetch my playlists
const getMyPlaylistData = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  try {
    await axios
      .get(`${BACKEND_URL}/feed/my-playlists/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        const playlistData = res.data;
        dispatch({
          type: 'myPlaylistData',
          myPlaylistData: playlistData,
        });
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Fetch all playlists
const getAllPlaylists = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const res = await axios.get(`${BACKEND_URL}/feed/playlist/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (res.status === 200) {
      dispatch({
        type: 'allPlaylists',
        allPlaylists: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Get a users profile data
const getProfileData = dispatch => async profileID => {
  const userID = await RNSInfo.getItem('user_id', {});
  const token = await RNSInfo.getItem('token', {});
  try {
    const res = await axios.get(`${BACKEND_URL}/users/user/${profileID}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (res.status == 200) {
      const profile_Data = res.data;
      dispatch({type: 'userProfileData', userProfileData: profile_Data});
      const followers = profile_Data.followers;
      const followersID = followers.map(item => item.user);
      const exists = followersID.some(
        id => id.toString() === userID.toString(),
      );
      if (exists) {
        return true;
      } else {
        return false;
      }
    } else {
      null;
    }
  } catch (error) {
    playlistContext?.dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

//Fetch a users playlists
const getPlaylistData = dispatch => async userID => {
  const token = await RNSInfo.getItem('token', {});
  try {
    await axios
      .get(`${BACKEND_URL}/feed/user-playlists/?id=${userID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        const playlistData = res.data;
        dispatch({type: 'userPlaylistData', userPlaylistData: playlistData});
      });
  } catch (error) {
    playlistContext?.dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

//Fetch followers playlists
const getFollowersPlaylists = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const res = await axios.get(`${BACKEND_URL}/feed/following-playlists/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (res.status === 200) {
      const Following_PLaylist = res.data;
      dispatch({
        type: 'followingPlaylists',
        followingPlaylists: Following_PLaylist,
      });
    }
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Fetch playlist data
const fetchPlaylist = dispatch => async id => {
  const token = await RNSInfo.getItem('token', {});
  try {
    await axios
      .get(`${BACKEND_URL}/feed/playlist-details/?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        const spotifyAuth = res.data?.isSpotifyAuth;
        dispatch({type: 'spotifyAuth', spotifyAuth: spotifyAuth});
        dispatch({
          type: 'playlistDetails',
          playlist: res.data?.playlistDetails,
        });
        dispatch({
          type: 'playlistTracks',
          tracks: res.data?.playlistTracks,
        });
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Delete playlist
const deletePlaylist = dispatch => async id => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const res = await axios.delete(
      `${BACKEND_URL}/feed/my-playlists/?id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    return res.status;
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Get all comments for playlist
const getComments = dispatch => async props => {
  playlist_id = props;
  // console.log('---', props);
  const token = await RNSInfo.getItem('token', {});
  try {
    axios
      .get(`${BACKEND_URL}/feed/comments-playlist/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        params: {
          id: playlist_id,
        },
      })
      .then(res => {
        // console.log('====', res.data);
        const comments = res.data;
        dispatch({
          type: 'comments',
          comments: comments,
        });
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Comment on playlist
const comment = dispatch => async props => {
  // console.log('imgs:', props.images);
  const token = await RNSInfo.getItem('token', {});
  // const ws = new WebSocket(`${BACKEND_URL}/ws/notif-socket/?token=${token}`);
  const data = {
    to_user: props.to_user.toString(),
    title: 'Cycles',
    image: props.images[0].image,
  };
  try {
    const response = await axios.post(
      `${ngrokURL}/feed/comments-playlist/`,
      {
        id: props.playlist_id,
        title: props.title,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    data['body'] = `${response.data.username} commented: ${props.title}`;
    data['playlist_id'] = props.playlist_id;
    data['type'] = 'comment';
    data['comment'] = response.data.id;
    data['follow'] = null;
    data['like'] = null;
    if (response.status === 201) {
      dispatch({type: 'POST_COMMENT', payload: response.data});
      // ws.onopen = () => {
      //   ws.send(JSON.stringify(data));
      // };
      try {
        axios.post(`${ngrokURL}/notifications/message/`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
      } catch (error) {
        null;
      }
    }
  } catch (err) {
    null;
  }
};

const deleteComment = dispatch => async id => {
  const token = await RNSInfo.getItem('token', {});
  try {
    await axios
      .delete(`${BACKEND_URL}/feed/comments-playlist/?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        value = res.data;
        dispatch({type: 'DELETE_COMMENT', payload: id});
      });
  } catch (err) {
    null;
  }
};

const checkIfLiked = dispatch => async id => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const isLiked = await axios.get(`${BACKEND_URL}/feed/like-playlist/`, {
      params: {
        id: id,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    // console.log('-=-=', isLiked);
    return isLiked;
  } catch (err) {
    null;
  }
};

// Like playlist
const likePlaylist = dispatch => async route => {
  const playlist_id = route.playlist_id;
  const token = await RNSInfo.getItem('token', {});
  const to_user = route.to_user;
  const playlist_cover = route.images;
  // const ws = new WebSocket(`${BACKEND_URL}/ws/notif-socket/?token=${token}`);
  const data = {
    to_user: to_user.toString(),
    title: 'Cycles',
    image: playlist_cover,
  };
  try {
    const response = await axios.post(
      `${ngrokURL}/feed/like-playlist/`,
      {
        id: playlist_id,
        like: 'True',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    const isLiked = response.data.like;
    data['like'] = response.data.id;
    data['body'] = `${response.data.username} liked your playlist.`;
    data['playlist_id'] = playlist_id;
    data['type'] = 'like';
    data['follow'] = null;
    data['comment'] = null;
    if (response.status === 201) {
      // ws.onopen = () => {
      //   ws.send(JSON.stringify(data));
      // };
      try {
        axios.post(`${BACKEND_URL}/notifications/message/`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
      } catch (error) {
        null;
      }
      return isLiked;
    } else {
      return false;
    }
  } catch (err) {
    null;
  }
};

// Unlike playlist
const unlikePlaylist = dispatch => async id => {
  console.log(id);
  const userToken = await RNSInfo.getItem('token', {});
  try {
    await axios
      .delete(`${BACKEND_URL}/feed/like-playlist/?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
      })
      .then(res => {
        value = res.data;
        // console.log('unlike:', value);
        return value;
        // dispatch({type: 'isLiked', isLiked: value});
      });
  } catch (err) {
    return false;
  }
};

// Follow user
const followUser = dispatch => async props => {
  const token = await RNSInfo.getItem('token', {});
  // const ws = new WebSocket(`${BACKEND_URL}/ws/notif-socket/?token=${token}`);
  const data = {
    to_user: props.to_user,
    title: 'Cycles',
    image: null,
  };
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/following/`,
      {user: props.currentUser, following_user: props.to_user.toString()},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    data['follow'] = response.data.id;
    data['body'] = `${response.data.username} started following you.`;
    data['type'] = 'follow';
    data['like'] = null;
    data['comment'] = null;
    if (response.status === 201) {
      // ws.onopen = () => {
      //   ws.send(JSON.stringify(data));
      // };
      axios.post(`${BACKEND_URL}/notifications/message/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
    }
  } catch (err) {
    null;
  }
};

// Unfollow user
const unfollowUser = dispatch => async props => {
  // console.log(props);
  const userToken = await RNSInfo.getItem('token', {});
  try {
    await axios.delete(`${BACKEND_URL}/users/following/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
      params: {
        user: props.currentUser,
        following_user: props.to_user,
      },
    });
  } catch (err) {
    null;
  }
};

//Fetch Spotify playlists from API
const getSpotifyPlaylist = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  try {
    await axios
      .get(`${BACKEND_URL}/spotify_api/spotify-playlist/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(res => {
        const data = res.data;
        dispatch({type: 'spotifyPlaylists', spotifyPlaylists: data});
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

//Select playlist
const selectPlaylist = dispatch => async item => {
  dispatch({
    type: 'selectedSpotifyPlaylist',
    selectedSpotifyPlaylist: item,
  });
  dispatch({type: 'isSelected', isSelected: item.id});
};

const clearSelectedPlaylist = dispatch => async () => {
  dispatch({type: 'selectedSpotifyPlaylist', selectedSpotifyPlaylist: null});
  dispatch({type: 'isSelected', isSelected: null});
};

export const {Provider, Context} = context(
  playlistReducer,
  {
    getMyProfileData,
    getMyPlaylistData,
    getAllPlaylists,
    getProfileData,
    getPlaylistData,
    getFollowersPlaylists,
    fetchPlaylist,
    deletePlaylist,
    getComments,
    comment,
    deleteComment,
    checkIfLiked,
    likePlaylist,
    unlikePlaylist,
    followUser,
    unfollowUser,
    getSpotifyPlaylist,
    selectPlaylist,
    clearSelectedPlaylist,
  },
  {
    defaultValue,
  },
);
