import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView} from 'react-native';
import styles from './styles'

class RaffleEnded extends Component
{
  render()
  {
    return (
      <View style={styles.container}>
        <Image source = {require("@Resources/Images/raffle_notification_bg_main.png")} style={styles.bg_image}>
        </Image>
        <Image source = {require("@Resources/Images/raffle_notification_bg.png")} style={styles.bg_image}>
        </Image>
        <Image source = {require("@Resources/Images/coins_bg.png")} style={styles.bg_coin}>
        </Image>
        <View style={styles.popup_bg_view}>
          <Image source = {require("@Resources/Images/popup-bg.png")} style={styles.popup_bg}>
          </Image>
          <Text style={ styles.hurry_text }>HURRAY!!!</Text>
          <View style={styles.user_view}>
              <Image source = {require("@Resources/Images/oval.png")} style={styles.user_image}>
              </Image>
              <Text style={ styles.user_name_text }>Robert Smith</Text>
          </View>
          <Text style={ styles.price_text }>You Won The 2nd Prize</Text>
          <View style={styles.coin_bg_view}>
            <Image source = {require("@Resources/Images/popup-bg-copy.png")} style={styles.coin_bg}>
            </Image>
            <View style={styles.coin_view}>
              <Image source = {require("@Resources/Images/token_big.png")}>
              </Image>
              <Text style={styles.coin_text}>1000</Text>
            </View>
          </View>
          <View style={styles.collect_view}>
            <Text style={styles.collect_text}>Collect</Text>
          </View>
        </View>
      </View>
    )
  }
}
export default RaffleEnded
