import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView} from 'react-native';
import styles from './styles'

class DriverEnteredLottery extends Component
{
  render()
  {
    return (
      <View style={styles.container}>
        <Image source = {require("@Resources/Images/dimmer.png")} style={styles.bg_image}>
        </Image>
        <Image source = {require("@Resources/Images/back-light.png")} style={styles.bg_image}>
        </Image>
        <View style={styles.popup_bg_view}>
          <Image source = {require("@Resources/Images/popup-bg.png")} style={styles.popup_bg}>
          </Image>
          <Text style={ styles.congratulations_text }>Congratulations!</Text>
          <Image source = {require("@Resources/Images/oval.png")} style={styles.user_image}>
          </Image>
          <Text style={ styles.user_name_text }>Robert Smith</Text>
          <Text style={ styles.price_text }>You have just entered today’s Raffle!</Text>
          <Text style={ styles.anounce_text}>Winners will be anounced at 9pm</Text>
          <View style={styles.current_price_view}>
            <Image source = {require("@Resources/Images/prize-box.png")} style={styles.coin_bg}>
            </Image>
            <Text style={styles.current_price_text}>Current Prize</Text>
            <View style={styles.coin_view}>
              <Image source = {require("@Resources/Images/token_big.png")}>
              </Image>
              <Text style={styles.coin_text}>4800</Text>
            </View>
          </View>
          <View style={styles.close_View}>
            <TouchableOpacity>
              <Text style={styles.close_text}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
export default DriverEnteredLottery
