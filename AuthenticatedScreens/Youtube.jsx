import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'


export default function YoutubeVideos() {
  return (
    <View style={{flex:1}}>
     <WebView 
     source={{uri:`www.youtube.com/watch?v=4aogJBDJm1U&list=PLCDs6e1iSUcz2TvHpFRJm1JiAKlyO5eNb&ab_channel=THEQuiverNews`}}
     userAgent={'Android 10'}
    allowsFullscreenVideo={true}
    style={{flex:1}}
    
     />
    </View>
  )
}