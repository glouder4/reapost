import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Icon, Text, Badge,Button, Tabs } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
function AppHeader(props){
  return(
      <Container>
      <Footer>            
        <LinearGradient
          colors={['#644ca0', '#ac3092','#d41d77','#ee372f']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height:"100%",
          }}>          
            <FooterTab style={{backgroundColor:'#402e6e'}}>
              <Button onPress={() => props.navigation.navigate('Анкеты',props.userData)}  vertical>
                {/*<Badge><Text>2</Text></Badge>*/}
                <Icon style={{color:"white"}} name="apps" />
                <Text style={{color:"white"}}>Новости</Text>
              </Button>
              <Button onPress={() => props.navigation.navigate('Взаимки')} vertical>
                {/*<Badge ><Text>51</Text></Badge>*/}
                <Icon style={{color:"white"}} active name="navigate" />
                <Text style={{color:"white"}}>Чаты</Text>
              </Button>
              <Button onPress={() => props.navigation.navigate('Бартеры')} vertical>
                {/*<Badge ><Text>51</Text></Badge>*/}
                <Icon style={{color:"white"}} active name="navigate" />
                <Text style={{color:"white"}}>Бартеры</Text>
              </Button>
              <Button onPress={() => props.navigation.navigate('Профиль',props.userData)} vertical>
                <Icon style={{color:"white"}} name="person" />
                <Text style={{color:"white"}}>Профиль</Text>
              </Button>  
              </FooterTab>          
        </LinearGradient>        
      </Footer>
      </Container>
    );
}
export default AppHeader;
