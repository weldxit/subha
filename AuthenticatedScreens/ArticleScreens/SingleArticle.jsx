import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Share,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { ScrollView } from "react-native-virtualized-view";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import msgpack from 'msgpack-lite';
const ArticlePage = () => {
  //states
  const [article, setArticle] = useState(null);
  const [title, settitle] = useState(null);
  const [content, setcontent] = useState(null);
  const [posted_at, setposted_at] = useState(null);
  const [category, setcategory] = useState(null);
  const [author, setauthor] = useState('THE Quiver');
  const [image, setimage] = useState('');
  const [loaded, setLoaded] = useState(false);

  const [quote, setQuote] = useState([]);
  const [randomIndex, setRandomIndex] = useState(0);
  const [maymissed, setMaymissedData] = useState([]);

  const tags = [
    {id:1,name:"Politics"},
    {id:2,name:"Business"},
    {id:3,name:"Education"},
    {id:4,name:"Farming"},
    {id:5,name:"Health & lifestyle"},
    {id:6,name:"Sports"},
    {id:7,name:"State"},
    {id:8,name:"National"},
    {id:9,name:"International"},
  ];
  // id	18
  // title	"gdf"
  // content	"gfdgdgdfgdfgdf"
  // author	null
  // posted_at	"2023-11-17T06:19:43.000+00:00"
  // image	"https://firebasestorage.…d-4265-9145-b8fc17e5a296"
  // category_id	6
  //functions
  const getArticle = async () => {
    try {
      const storedArticle = await AsyncStorage.getItem('article');
      if (storedArticle) {
        const decodedArticle = msgpack.decode(storedArticle)
        const parsedArticle = JSON.parse(decodedArticle);
        const {title, content, posted_at, category_id, image } = parsedArticle;
  
        setArticle(parsedArticle);
        settitle(title)
        setcontent(content);
        setposted_at(posted_at);
        setcategory(category_id);
        setimage(image);
        setLoaded(true);
  
        // After successfully using the data, remove the stored article
        await AsyncStorage.removeItem('article');
      } else {
        // Handle the case where no article is found in AsyncStorage
        console.log('No article found in AsyncStorage');
        setLoaded(true); // Set loaded to true to render the UI without data
      }
    } catch (error) {
      // Handle AsyncStorage retrieval or parsing errors
      console.error('Error retrieving or parsing article:', error);
      setLoaded(true); // Set loaded to true to render the UI without data
    }
  };
  

  const fetchQuotes = async () => {
    try {
      const response = await fetch('https://type.fit/api/quotes');
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }
  
      const data = await response.json();
      setQuote(data);
      const index = Math.floor(Math.random() * data.length);
      setRandomIndex(index);
    } catch (error) {
      console.error('Error fetching quotes:', error.message);
      // Handle the error state or other actions as needed
    }
  };

  const fetchMaymissed = async () => {
    try {
      const response = await fetch('https://server-for-quiver.onrender.com/maymisseddata');
      if (!response.ok) {
        throw new Error('Failed to fetch maymissed data');
      }
      const data = await response.json();
      setMaymissedData(data);
    } catch (error) {
      console.error('Error fetching maymissed data:', error.message);
      // Handle the error state or other actions as needed
    }
  };

  const clickedMissed = async (item) =>{
    setLoaded(false)
    settitle(item.title)
    setbody(item.content)
    setauthor(item.author)
    setposted_at(item.posted_at)
    setcategory(item.category_id)
    setLoaded(true)
    fetchQuotes()
  }

  function convertTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
  
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}, ${hours}:${minutes}`;
    return formattedDate;
  }
  //hooks
  useEffect(() => {
   getArticle()
   fetchQuotes()
   const timer = setTimeout(fetchMaymissed, 4000);
   return () => clearTimeout(timer);
  }, []);

  const articleContent = useMemo(() => {
    if (content) {
      return content.substring(0, 100);
    }
    return '';
  }, [content]);
  
  const link = useMemo(() => `https://thequiver.in`);

  const ShareIt = useCallback(async () => {
    try {
      const result = await Share.share({
        message: articleContent,
        url: link,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }, [articleContent, link]);

  //components

  const MemoizedPopularItemToday = React.memo(({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={(item) => clickedMissed(item)}
      >
        <View style={styles.thumbTimeStamp}>
          <Image
            source={item.thumbnail}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <Text style={styles.timeago}>{item.posted_at}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.cardTitle}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.cardDescip} numberOfLines={3}>
              {item.content}
            </Text>
            <Text style={styles.cardCategory}>{tags[item.category_id].name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  });
  //data
 
  return (
    <View style={styles.container}>
     {!loaded ?  <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animatable.Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '600',
          }}
          animation="fadeIn"
          duration={1500}
          delay={500}>
          {quote[randomIndex]?.text}
        </Animatable.Text>
      </View>
    </View> : <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View
          style={styles.titleContainer1}
          animation={"fadeInDown"}
          duration={700}
        >
          <Text style={styles.title}>{title}</Text>
        </Animatable.View>
        <Animatable.View animation={"bounceInUp"} duration={300}>
          <View style={styles.stamps}>
            <Text style={styles.stamptext}>{()=>convertTimestamp(posted_at)}</Text>
            <Text style={styles.stamptext}>
              {/* <Image
                source={require("../../assets/icon/pin.png")}
                style={styles.locationpin}
              /> */}
              Bhubaneswar
            </Text>
            <View>
              <Text
                style={[
                  styles.stamptext,
                  { color: "#ff0000", opacity: 1, fontWeight: "700" },
                ]}
              >
                #{tags[category].name}
              </Text>
            </View>
          </View>
          <Image
            source={{
              uri:image,
            }}
            style={[styles.image]}
          />

          <View style={styles.courtesytag}>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  opacity: 0.5,
                  fontSize: responsiveFontSize(1.5),
                }}
              >
                Courtesy
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveFontSize(1.9),
                }}
              >
                The Quiver
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  opacity: 0.5,
                  fontSize: responsiveFontSize(1.5),
                }}
              >
                Posted by
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveFontSize(1.9),
                }}
              >
                The Quiver
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => ShareIt()}>
                {/* <Image
                  source={require("../../assets/icon/share.png")}
                  style={styles.shareImage}
                /> */}
              </TouchableOpacity>
            </View>
          </View>

          <Animatable.View
            style={styles.contentContainer}
            animation={"fadeInDown"}
            delay={500}
          >
            <Animatable.Text style={styles.content}>
              {content}
            </Animatable.Text>
          </Animatable.View>
        </Animatable.View>
        {/* <Button title='share' onPress={()=>{console.log('clicked')}} style={{zIndex:2}}/>
         */}
        <Text
          style={{
            marginHorizontal: responsiveWidth(1.5),
            fontSize: responsiveFontSize(2.2),
            marginVertical: responsiveHeight(1.5),
            fontWeight: "500",
          }}
        >
          Also read
        </Text>

        <View style={styles.viewMoreContainer}>
          <FlatList
            data={maymissed}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={<></>}
            renderItem={({ item }) => <MemoizedPopularItemToday item={item} />}
          />
        </View>
      </ScrollView>   
     }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: responsiveHeight(30),
    resizeMode: "cover",
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    // padding: 20,
    marginHorizontal: responsiveWidth(1.4),
    // borderBottomWidth:1,
    // borderBottomColor:'black'
  },
  titleContainer1: {
    // marginTop: 200, // Adjust this value to ensure proper spacing between the image and the title
    // alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "justify",
  },
  content: {
    fontSize: responsiveFontSize(2.4),
    textAlign: "justify",
    marginTop:responsiveHeight(1.5)
    // marginBottom:responsiveHeight(1.5),
    // alignSelf:'center'
  },
  stamps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1),
  },
  stamptext: {
    color: "black",
    fontSize: responsiveFontSize(1.9),
    fontWeight: "400",
    opacity: 0.5,
  },
  locationpin: {
    height: 15,
    width: 10,
    marginHorizontal: responsiveWidth(1),
  },
  courtesytag: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: responsiveWidth(1.5),
    marginHorizontal: responsiveWidth(1.5),
    // backgroundColor:'pink',
    height: responsiveHeight(6),
    alignItems: "center",
  },
  shareImage: {
    height: responsiveHeight(5),
    width: responsiveWidth(7.5),
    // alignSelf: "center",
    resizeMode: "contain",
  },
  viewMoreContainer: {
    marginHorizontal: responsiveWidth(1.5),
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    width: responsiveWidth(94),
    height: responsiveHeight(13),
    // marginHorizontal: responsiveWidth(1),
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    elevation: 1.5,
  },
  cardContent: {
    justifyContent: "space-between",
  },
  titleContainer: {
    width: responsiveWidth(62),
    // backgroundColor:'red',
    // justifyContent:'space-between',
    marginLeft: responsiveWidth(0.5),
    // textAlign:'justify'
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: "600",
    // width:responsiveWidth(5),
    // flexWrap:'wrap'
  },
  cardDescip: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.7),
  },
  cardCategory: {
    color: "red",
    fontWeight: "bold",
    fontStyle: "italic",
    // alignSelf:'flex-end'
  },
  timestamp: {
    alignSelf: "flex-end",
    marginRight: responsiveWidth(1),
  },
  cardImage: {
    height: responsiveHeight(10),
    width: responsiveWidth(30),
    borderRadius: 5,
  },
  timeago: {
    // marginBottom:10
    fontSize: responsiveFontSize(1.5),
    marginLeft: responsiveWidth(1),

    // paddingBottom:20
  },
  thumbTimeStamp: {
    justifyContent: "space-around",
  },
});

export default React.memo(ArticlePage);
