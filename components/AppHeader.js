import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Icon, Text, Badge,Button, Tabs } from 'native-base';
function AppHeader(props){
  return(
      <Container>
        <Footer>
          <FooterTab>
            <Button onPress={() => props.navigation.navigate('NewsFeed',props.userData)}  badge vertical>
              <Badge><Text>2</Text></Badge>
              <Icon name="apps" />
              <Text>Новости</Text>
            </Button>
            <Button onPress={() => props.navigation.navigate('SignIn')} vertical>
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>
            <Button onPress={() => props.navigation.navigate('SignIn',dt)} active badge vertical>
              <Badge ><Text>51</Text></Badge>
              <Icon active name="navigate" />
              <Text>Navigate</Text>
            </Button>
            <Button onPress={() => props.navigation.navigate('Profile',props.userData)} vertical>
              <Icon name="person" />
              <Text>Профиль</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
}
export default AppHeader;
