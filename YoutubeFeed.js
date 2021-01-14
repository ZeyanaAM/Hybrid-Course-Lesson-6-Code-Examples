import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SectionList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

const searchIcon = require('./assets/search.png');
const closeIcon = require('./assets/close.png');
const confirmIcon = require('./assets/confirm.png');

const Logo = () => (
  <>
    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>YouTube</Text>
  </>
);

const SearchIcon = ({ setShowSearchBar }) => (
  <TouchableOpacity onPress={() => setShowSearchBar(true)}>
    <Image source={searchIcon} style={{ width: 30, height: 30 }} />
  </TouchableOpacity>
);

const Header = ({ setShowSearchBar }) => (
  <View style={styles.header}>
    <Logo />
    <SearchIcon setShowSearchBar={setShowSearchBar} />
  </View>
);

const CloseButton = ({ onClosePressed }) => (
  <TouchableOpacity onPress={onClosePressed}>
    <Image source={closeIcon} style={{ width: 12, height: 12 }} />
  </TouchableOpacity>
);

const SearchButton = ({ searchValue, allVideoItems, setVideoItems }) => (
  <TouchableOpacity
    onPress={() => {
      setVideoItems(
        allVideoItems.filter((item) => item.title.includes(searchValue))
      );
    }}
  >
    <Image source={confirmIcon} style={{ width: 25, height: 25 }} />
  </TouchableOpacity>
);

const SearchBar = ({ setShowSearchBar, videoItems, setVideoItems }) => {
  const [searchValue, setSearchValue] = useState('');
  const [allVideoItems, setAllVideoItems] = useState(videoItems);

  const onClosePressed = () => {
    setVideoItems(allVideoItems);
    setSearchValue('');
    setShowSearchBar(false);
  };

  return (
    <View style={styles.header}>
      <CloseButton
        setShowSearchBar={setShowSearchBar}
        onClosePressed={onClosePressed}
      />
      <TextInput
        placeholder="Enter search"
        value={searchValue}
        // onChangeText={(value) => setSearchValue(value)}
        onChangeText={setSearchValue}
      />
      <SearchButton
        setShowSearchBar={setShowSearchBar}
        searchValue={searchValue}
        allVideoItems={allVideoItems}
        setVideoItems={setVideoItems}
      />
    </View>
  );
};

const VideoPost = ({ title, channel, thumbnail }) => (
  <View style={styles.videoPost}>
    <Image source={{ uri: thumbnail }} style={{ width: '100%', height: 200 }} />
    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
      <Text style={styles.videoTitle}>{title}</Text>
      <Text style={styles.channel}>{channel}</Text>
    </View>
  </View>
);
const VideoFeed = ({ data }) => (
  <View style={styles.videoFeed}>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <VideoPost
          title={item.title}
          channel={item.channel}
          thumbnail={item.thumbnail}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  </View>
);

export default function YoutubeFeed() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [videoItems, setVideoItems] = useState([]);

  const fetchVideos = async () => {
    const API_KEY = 'AIzaSyDPOYaRFFuIqgA-QsYP8OZvjOB4cV3lpts'; // 'AIzaSyC0U9QWdWNITVbiO5NrgnkKPqMc1rxt4eI';
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&key=${API_KEY}`
    );
    const json = await response.json();
    // console.log("video items:", json)
    const videoItems = [];
    json.items.forEach((item) => {
      const videoItem = {
        id: item.id,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
      };
      videoItems.push(videoItem);
    });
    // console.log(videoItems);
    setVideoItems(videoItems);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {showSearchBar ? (
        <SearchBar
          setShowSearchBar={setShowSearchBar}
          videoItems={videoItems}
          setVideoItems={setVideoItems}
        />
      ) : (
        <Header setShowSearchBar={setShowSearchBar} />
      )}
      {videoItems.length == 0 ? (
        <Button title="Load Feed" onPress={fetchVideos} />
      ) : (
        <VideoFeed data={videoItems} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingBottom: 5,
    width: '100%',
  },

  searchBar: {},

  videoFeed: {
    width: '100%',
  },

  videoPost: {
    marginBottom: 10,
    width: '100%',
  },

  videoTitle: {
    // fontWeight: 'bold',
    fontSize: 18,
  },
  channel: {
    color: '#606060',
    fontSize: 15,
  },
});
