import React, { Component } from 'react';
import { StyleSheet, Image,ScrollView } from 'react-native';
import { Container,Button, Header, View,Content, DeckSwiper, Card, CardItem, Thumbnail, Text,Right, Left, Body, Icon } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles.js';

var cards = [
  {
    text: 'Card One',
    name: 'One',
    image: 'http://192.168.0.101:3000/images/users_posts/',
  },
];

class Post extends Component{
   state = {
    loading: true
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ loading: false })
  }
  render() {
    var body = this;
    /*for(var i =0; i < body.props.attachment.length;i++){
      cards.push({
        text: 'Card '+body.props[i].,
        name: 'One',
        image: 'http://192.168.0.101:3000/images/users_posts/',
      })
    }*/console.log(body.props.attachment.length);
       if (this.state.loading) {
         return (
           <View></View>
         );
       }
        return (
          <Container style={{height:550}}>
            <View>
              <DeckSwiper
                dataSource={cards}
                renderItem={item =>
                  <Card style={{ elevation: 3 }}>                
                    <CardItem>
                      <Left>
                        <Thumbnail source={{uri:(item.image+body.props.attachment)}} />
                        <Body>
                          <Text>{item.text}</Text>
                          <Text note>NativeBase</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <Image style={{ height: 300, flex: 1 }} source={{uri:(item.image+body.props.attachment)}} />
                    </CardItem>
                    <CardItem>
                    <Left>
                      <Button transparent onPress={() =>{ color:'#ED4A6A' }}>
                        <Icon active name="thumbs-up" />
                        <Text>{body.props.likes} Likes</Text>
                      </Button>
                    </Left>
                    <Body>
                      <Button transparent>
                        <Icon active name="chatbubbles" />
                        <Text>4 Comments</Text>
                      </Button>
                    </Body>
                    <Right>
                      <Text>11h ago</Text>
                    </Right>
                  </CardItem> 
                  </Card>
                }
              />
            </View>
          </Container>
        );
   }
}
export default Post;