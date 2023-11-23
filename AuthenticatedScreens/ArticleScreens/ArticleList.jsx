import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from "react";

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'

import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import * as Animatable from "react-native-animatable";
import axios from "axios";
import msgpack from 'msgpack-lite';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ArticleList({ setClickedCallback }) {


  const [data, setData] = useState([]);
  const [catdata, setCatdata] = useState([])
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const limit = 10;
  const [offset, setOffset] = useState(1)
  const [offset1, setOffset1] = useState(0)
  const [error, setError] = useState(null)
  const [initialScroll, setInitialScroll] = useState(0)
  const height = Dimensions.get('window').height
  const flatListRef = useRef(null);

  const scrollToIndex = useCallback((index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  }, []);
  const tags = [
    { id: 0, name: "Home" },
    { id: 1, name: "Politics" },
    { id: 2, name: "Business" },
    { id: 3, name: "Education" },
    { id: 4, name: "Farming" },
    { id: 5, name: "Health & lifestyle" },
    { id: 6, name: "Sports" },
    { id: 7, name: "State" },
    { id: 8, name: "National" },
    { id: 9, name: "International" },
  ];




  const [reachedEnd, setReachedEnd] = useState(false);

  // Adjust your function for fetching more data on end reached:
  // const getMoreData = useCallback(async () => {
  //   if (!loading && !reachedEnd) {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`https://server-for-quiver.onrender.com/todays_news?limit=${limit}&offset=${offset}`);
  //       if (response.data.length > 0) {
  //         setData((prevData) => [...prevData, ...response.data]);
  //         setOffset(offset + limit);
  //       } else {
  //         setReachedEnd(true); // Set reachedEnd flag when there's no more data
  //       }
  //     } catch (error) {
  //       console.error('Error loading more news:', error);
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // }, [loading, offset, reachedEnd]);

  const loadInitialNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https:///todays_news?limit=${limit}`);
      setData(response.data);
    } catch (error) {
      console.error('Error loading news:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);


  const getRefreshedNews = useCallback(async () => {
    if (!loading && !reachedEnd) {
      setLoading(true);
      try {
        const response = await axios.get(`https://server-for-quiver.onrender.com/todays_news?limit=${limit}&offset=${offset}`);
        if (response.data.length > 0) {
          // Append new data to existing data
          setData((prevData) => [...prevData, ...response.data]);
          // Update offset for the next fetch
          setOffset((prevOffset) => prevOffset + limit);
        } else {
          setReachedEnd(true); // Set reachedEnd flag when there's no more data
        }
      } catch (error) {
        console.error('Error loading more news:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, offset, reachedEnd]);


  // const getLatestNews = useCallback(async () => {
  //   // console.log('hello')
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`https://server-for-quiver.onrender.com/todays_news?limit=${limit}`);
  //     setData(response.data);
  //     // setOffset(offset + limit);
  //   } catch (error) {
  //     console.error('Error loading news:', error);
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const onRefreshFeed = useCallback(() => {
    setLoading(true);
    if (activeItem !== null) {
      getRefreshedNewsByCategory(activeItem);
    } else {
      getRefreshedNews()
        .then(() => setInitialScroll((prevScroll) => prevScroll + 9))
        .catch((error) => {
          setError(error);
        })
        .finally(() => setLoading(false));
    }
  }, [activeItem]);
  

  const getNewsByCategory = useCallback(async (item) => {
    setLoading(true);
    try {
      if (item === 0) {
        setCatdata(data); // Set the initial data for the Home category
      } else {
        const response = await axios.get(`https://server-for-quiver.onrender.com/category/${item}`);
        setCatdata(response.data);
      }
    } catch (error) {
      console.error('Error loading news by category:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  const getRefreshedNewsByCategory = useCallback(async (item) => {
    if (!loading && !reachedEnd) {
      setLoading(true);
      try {
        const response = await axios.get(`https://server-for-quiver.onrender.com/category/${item.id}?limit=${limit}&offset=${offset}`);
        if (response.data.length > 0) {
          // Append new category-based data to existing data
          setData((prevData) => [...prevData, ...response.data]);
          // Update offset for the next fetch
          setOffset((prevOffset) => prevOffset + limit);
        } else {
          setReachedEnd(true); // Set reachedEnd flag when there's no more data
        }
      } catch (error) {
        console.error('Error loading more news:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, offset, reachedEnd]);


  //   const filterPress = useCallback(
  //     (item) => {

  //         getNewsByCategory(item);
  //     },
  //     []
  // );
  // id	18
  // title	"gdf"
  // content	"gfdgdgdfgdfgdf"
  // author	null
  // posted_at	"2023-11-17T06:19:43.000+00:00"
  // image	"https://firebasestorage.…d-4265-9145-b8fc17e5a296"
  // category_id	6

  const renderArticle = async (item) => {
    try {
      const stringifiedItem = JSON.stringify(item);

      const serializedValue = msgpack.encode(stringifiedItem);

      // Check the size of the article data before storing it
      if (serializedValue.length > MAX_STORAGE_SIZE) {
        // Handle larger data appropriately (e.g., notify the user, store in parts, etc.)
        console.error('Article data is too large for AsyncStorage');
        return;
      }
  
      await AsyncStorage.setItem('article', serializedValue);
      setClickedCallback(true);
    } catch (error) {
      console.error('Error storing article in AsyncStorage:', error);
      // Handle AsyncStorage error (e.g., show an error message)
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadInitialNews();
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, []);




  const MemoizedFlatListFilter = React.memo(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {getNewsByCategory(item.id);scrollToIndex(index);}}
        style={[
          styles.filtercontainer,
          { backgroundColor: activeItem === item.id ? "white" : "red", borderWidth: activeItem === item.id ? 1 : 0, borderColor: activeItem === item.id ? 'red' : 'none' }
        ]}
      >
        <Text style={[styles.filtertag, { color: activeItem === item.id ? "red" : "white", fontSize: responsiveFontSize(2.5), fontWeight: 'bold' }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  }, [activeItem]);

  const MemoizedPopularItemToday = React.memo(({ item, index }) => {

    return (
      <TouchableOpacity
        // style={styles.cardContainer}
        onPress={(item) => renderArticle(item)}
      >
        <Animatable.View
          style={styles.cardContent}
          animation="fadeIn"
          duration={1000}
          delay={index * 100}
        >
          <View style={styles.cardWrapper}>
            <View style={styles.slug_cat_img_wrapper}>
              <View style={styles.slug_wrapper}>
                <Text style={styles.slug} numberOfLines={4}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.cat_img_wrapper}>
                <Text style={styles.cat}>{tags[item.category_id] ? tags[item.category_id].name : tags[activeItem].name}</Text>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
              </View>
            </View>
            <View style={styles.content_wrapper}>
              <Text style={styles.content} numberOfLines={3}>
                {item.content}
              </Text>
            </View>
            {/* <View style={styles.time_loc_stamp}>
              <Text style={styles.stamp_text}>{'\u231B'} 2 hr ago</Text>
            
            </View> */}
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadInitialNews} />
        }
      >
        <View style={styles.latestArticlesContainer}>
          <View>
            <FlatList data={tags} ref={flatListRef} horizontal keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => (<MemoizedFlatListFilter item={item} />)} />
          </View>

          {
            !loading ? (<FlatList data={(!activeItem || activeItem === tags[0].id) ? data : catdata.length > 0 ? catdata : []} initialNumToRender={10} maxToRenderPerBatch={10} windowSize={10} removeClippedSubviews={true} onEndReached={onRefreshFeed} onEndReachedThreshold={0.3} initialScrollIndex={initialScroll} keyExtractor={(item, index) => index.toString()} getItemLayout={(data, index) => ({
              length: responsiveHeight(30),
              offset: responsiveHeight(30) * index,
              index,
            })} renderItem={({ item, index }) => { return <MemoizedPopularItemToday item={item} index={index} /> }} />) :
              (<View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: height - 200,
                }}
              >
                <Image
                  source={{ uri: "https://cdn.pixabay.com/photo/2023/10/12/12/55/woman-8310751_1280.jpg" }}
                  height={700}
                  width={300}
                  resizeMode="contain"
                />
              </View>)
          }

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  topAutoscrollBanner: {
    maxHeight: 200,
    marginHorizontal: responsiveWidth(1.5),
  },
  latestYoutube: {
    fontSize: responsiveFontSize(3),
    fontStyle: "normal",
    fontWeight: "bold",
    paddingVertical: responsiveHeight(1),
  },
  latestArticlesContainer: {
    marginTop: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1.2),
    // backgroundColor: "gray",
  },
  latestHeading: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    paddingVertical: responsiveHeight(1),
    marginHorizontal: responsiveHeight(0.7),
  },
  filtercontainer: {
    height: responsiveHeight(5),
    width: "auto",
    justifyContent: "center",
    marginRight: responsiveWidth(2),
    // borderRadius: responsiveWidth(10),
    borderWidth: responsiveWidth(0),
    borderRadius: 9,
  },
  filtertag: {
    textAlign: "center",
    paddingHorizontal: 5,
  },

  popularHead: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popularCard: {
    backgroundColor: "white",
    width: 250,
    height: 200,
    flexDirection: "column",
    justifyContent: "flex-start",
    elevation: 4,
    marginTop: responsiveHeight(2),
    borderTopColor: "lightblue",
    // borderTopWidth:5,
    // borderTopLeftRadius:10,
    borderRadius: 10,
  },
  pCardImage: {
    width: 250,
    height: 125,

    // backgroundColor:'red'
  },
  pCardImageText: {
    margin: 0,
    padding: 0,
  },
  popularTagHead: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
  },
  popularMore: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    color: "blue",
    // textDecorationStyle:'dashed'
    marginTop: 9,
  },

  //card
  cardContent: {
    // marginTop:responsiveHeight(3),
    // paddingHorizontal:5
    marginVertical: responsiveHeight(0.5),
    // backgroundColor:'red',
    // borderWidth:1,
    borderBottomWidth: 3,
    borderBottomColor: '#ff5151'
    // borderColor:'blue'
  },
  cardWrapper: {
    height: responsiveHeight(30),
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 5,
    padding: 5,
    // borderBottomWidth:1,
    // borderBottomColor:'red',
  },
  slug_cat_img_wrapper: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    // justifyContent:'space-between'
    // justifyContent:'flex-end'
    // height:responsiveHeight(15)
  },
  cat: {
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
    backgroundColor: "red",
    alignSelf: "flex-end",
    borderRadius: 5,
    // padding:2
    marginBottom: 2,
    paddingHorizontal: 10,
    color: "white",
  },
  content_wrapper: {
    flex: 1,
    marginTop: responsiveHeight(1.5),
  },
  content: {
    fontSize: responsiveFontSize(2),
  },
  slug_wrapper: {
    flex: 1,
    // justifyContent:'center'
  },
  slug: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    // marginTop:10,
    // textAlign:'justify'
  },
  cat_img_wrapper: {},
  image: {
    height: responsiveHeight(12),
    width: responsiveWidth(40),
    borderRadius: 5,
  },
  time_loc_stamp: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  stamp_text: {
    fontSize: responsiveFontSize(2),
    marginVertical: responsiveHeight(1.5),
    fontWeight: "500",
  },
})