import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView} from 'react-native';
import styles from './styles'

class RiderNotified extends Component
{
  render()
  {
    return (
      <View style={styles.container}>
        <Image source = {require("@Resources/Images/dimmer.png")} style={styles.bg_image}>
        </Image>
        <View style={styles.popup_bg_view}>
           <View style={styles.popup_bg_sub_view1}>
              <Text style={ styles.congratulations_text }>Congratulations!</Text>
              <View style={styles.user_bg_view}>
                <Image source = {require("@Resources/Images/oval.png")} style={styles.user_image}>
                </Image>
                <View style={styles.user_address_view}>
                  <Text style={ styles.user_name_text }>Robert Smith</Text>
                  <Text style={ styles.user_address_text }>Red Toyota Prius</Text>
                  <Text style={ styles.user_address_text }>Plate Number:1234567</Text>
                </View>
              </View>
              <Text style={ styles.pickup_text }>Will Pick You Up</Text>
           </View>
           <View style={styles.popup_bg_sub_view2}>
              <View style={styles.call_view}>
                  <Text style={ styles.call_text }>Call Robert</Text>
              </View>
              <View style={styles.close_View}>
                <TouchableOpacity>
                  <Text style={styles.close_text}>Close</Text>
                </TouchableOpacity>
              </View>
           </View>
        </View>
      </View>
    )
  }
}
export default RiderNotified
