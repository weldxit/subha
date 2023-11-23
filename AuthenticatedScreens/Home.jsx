import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ArticleList from './ArticleScreens/ArticleList'
import SingleArticle from './ArticleScreens/SingleArticle'
const Stack = createNativeStackNavigator()
export default function Home() {
  const [clicked, setClicked] = useState(false);
  const setClickedCallback = useCallback(
    (isLoggedIn) => {
      setClicked(isLoggedIn);
    },
    [setClicked]
  );
  const memoizedSetLoggedIn = useMemo(() => setClickedCallback, [setClickedCallback]);

  return (
   <Stack.Navigator>
    {
      !clicked ? (
        <Stack.Screen name='ArticleList'  options={{ headerShown: false }} >
           {(props) => <ArticleList {...props} setClickedCallback={memoizedSetLoggedIn} />}
        </Stack.Screen>
      ) : (<Stack.Screen name='SingleArticle' component={SingleArticle} options={{headerShown:false}}/>) 
    }
   </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})