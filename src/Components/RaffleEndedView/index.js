import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,TouchableHighlight,Alert,ScrollView,Dimensions} from 'react-native';
import styles from './styles'
import BackgroundImage from '@Components/BackgroundImage'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class RaffleEnded extends Component
{

  closeRaffleEndedView(){
    this.props.closeRaffleEndedViewCall();
  }

  collectPrice(){
      Alert.alert('Alert','Collect Price');
  }
  static propTypes = {
     closeRaffleEndedViewCall: React.PropTypes.func.isRequired,
   };


  render()
  {

    const {raffleTotalPrice,userPic,userName,source, children, style, ...props} = this.props

    return (
      <View style={styles.container}>
        <Image source = {require("@Resources/Images/raffle_notification_bg_main.png")} style={styles.bg_image}>
        </Image>
        <Image source = {require("@Resources/Images/raffle_notification_bg.png")} style={styles.bg_image}>
        </Image>
        <Image source = {require("@Resources/Images/coins_bg.png")} style={styles.bg_coin}>
        </Image>
        <TouchableHighlight  onPress={this.closeRaffleEndedView.bind(this)}>
          <View style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:5}}>
          <Image source = {require("@Resources/Images/close.png")} style={{width:34,height:34}}>
          </Image>
          <Text style={{fontSize:16,color:'#FFF',fontFamily:'Exo-Regular',textAlign:'center'}}>Close</Text>
          </View>
        </TouchableHighlight >

        <View style={styles.popup_bg_view}>
          <Image source = {require("@Resources/Images/popup-bg.png")} style={styles.popup_bg}>
          </Image>
          <Text style={ styles.hurry_text }>HURRAY!!!</Text>
          <View style={styles.user_view}>
              <View style={styles.avatarWrapper}>
              <Image source = {{uri:userPic}} style={styles.imageAvatar}>
              </Image>
              </View>
              <Text style={ styles.user_name_text }>{userName}</Text>
          </View>
          <Text style={ styles.price_text }>You Won The 1st Prize</Text>
          <View style={styles.coin_bg_view}>
          <Image source = {require("@Resources/Images/popup-bg-copy.png")} style={styles.coin_bg}>
                    </Image>
            <View style={styles.coin_view}>
              <Image source = {require("@Resources/Images/token_big.png")}>
              </Image>
              <Text style={styles.coin_text}>1000</Text>
            </View>
          </View>

        </View>
      </View>
    )
  }
}
export default RaffleEnded

// <TouchableHighlight  onPress={this.collectPrice.bind(this)}>
// <View style={styles.collect_view}>
//   <Text style={styles.collect_text}>Collect</Text>
// </View>
// </TouchableHighlight>
