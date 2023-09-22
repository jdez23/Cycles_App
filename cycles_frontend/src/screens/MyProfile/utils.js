import {useNavigation} from '@react-navigation/native';

//Navigate to playlist detail screen
const onPlaylistDetail = async item => {
  navigation.navigate({
    name: 'PlaylistDetail',
    params: {playlist_id: item.id, userToken: state.token},
  });
};

// console.log(profileData[0].name);

const onEditProfile = () => {
  navigation.navigate({
    name: 'EditProfile',
    params: {profile_data: profileData},
    merge: true,
  });
};

const onProfileSettings = () => {
  navigation.navigate({
    name: 'ProfileSettings',
    params: {user_id: profileData.id},
  });
};

const onFollowers = item => {
  navigation.navigate({name: 'FollowersList', params: {user_id: item}});
};

const onFollowing = item => {
  navigation.navigate({name: 'FollowingList', params: {user_id: item}});
};
