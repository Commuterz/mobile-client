import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,TouchableHighlight,Alert,ScrollView} from 'react-native';
import styles from './styles'
import BackgroundImage from '@Components/BackgroundImage'
import BackgroundTimer from 'react-native-background-timer';

var time ='';
class RaffleNotification extends Component
{
  constructor(props){
    super(props)

  }
  componentWillMount() {
  }

  closeRaffleView(){
    //alert('close');
    this.props.closeRaffleViewCall();
  }

 static propTypes = {
    closeRaffleViewCall: React.PropTypes.func.isRequired,
  };

  render()
  {
    const {raffleTime,TimeToRaffleHours,TimeToRaffleMinutes,TimeToRaffleSeconds,rafflePoolSize,raffleWinners1Prize,raffleWinners2Prize,raffleWinners3Prize,
      raffleWinners4Prize,  raffleWinners5Prize,raffleTotalWinners,raffleTotalPrice, raffleParticipants,
      source, children, style, ...props} = this.props

    return (

      <View style={styles.container}>
      <Image source = {require("@Resources/Images/raffle_notification_bg_main.png")} style={styles.bg_image}>
      </Image>
      <Image source = {require("@Resources/Images/raffle_notification_bg.png")} style={styles.bg_image}>
      </Image>
      <Image source = {require("@Resources/Images/coins_bg.png")} style={styles.bg_pool_coin}>
      </Image>
        <ScrollView style={{width:'100%',height:'100%'}}>
        <View style={{width:'100%',height:'100%',}}>
        <TouchableHighlight  onPress={this.closeRaffleView.bind(this)}>
          <View style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:5}}>
          <Image source = {require("@Resources/Images/close.png")} style={{width:34,height:34}}>
          </Image>
          <Text style={{fontSize:16,color:'#FFF',fontFamily:'Exo-Regular',textAlign:'center'}}>Close</Text>
          </View>
        </TouchableHighlight >
        <View style = {styles.timer_view}>
          <Text style={styles.time_remained_text}>Time Remained to Raffle!</Text>
          <View style={ [styles.fieldNameContainer, { justifyContent: 'space-around' }] }>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{TimeToRaffleHours}</Text>
              <Text style={ styles.textTimeLabel }>HRS</Text>
            </View>
            <View>
              <Text style={ styles.textDotValue }>:</Text>
              <Text style={ styles.textTimeLabel }></Text>
            </View>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{TimeToRaffleMinutes}</Text>
              <Text style={ styles.textTimeLabel }>MNS</Text>
            </View>
            <View>
              <Text style={ styles.textDotValue }>:</Text>
              <Text style={ styles.textTimeLabel }></Text>
            </View>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{TimeToRaffleSeconds}</Text>
              <Text style={ styles.textTimeLabel }>SEC</Text>
            </View>
          </View>
        </View>
        <View style = {styles.pool_size_view}>
          <Text style={styles.current_pull_size_text}>Current Pool Size</Text>
          <View style={ [styles.pull_size_container, { justifyContent: 'center' }] }>
            <Image source = {require("@Resources/Images/token_big.png")}>
            </Image>
            <Text style={styles.pull_size_value_text}>{rafflePoolSize}</Text>
          </View>
        </View>
        <View style = {{flex:1}}>
        </View>
        <View style = {styles.middle_view}>
          <View style = {styles.participants__view}>
            <Text style={styles.participants_text}>Participants</Text>
            <View style = {styles.participants_sub_view}>
              <Image source = {require("@Resources/Images/person.png")}>
              </Image>
              <Text style={styles.participants_text}>{raffleParticipants}</Text>
            </View >
          </View>
          <View style = {styles.participants__view}>
            <Text style={styles.participants_text}>Winners</Text>
            <View style = {styles.participants_sub_view}>
              <Image source = {require("@Resources/Images/winner_icon.png")}>
              </Image>
              <Text style={styles.participants_text}>{raffleTotalWinners}</Text>
            </View >
          </View>
        </View>

         <View style={{width:'100%',backgroundColor:'rgba(0, 0, 0, 0.71)'}}>

          <View style = {styles.bottom_price_view}>
            <Image source = {require("@Resources/Images/trophy.png")}>
               <Text style={styles.first_price_text}>1</Text>
             </Image>
            <View style = {styles.first_price_text_view}>
               <Text style={styles.first_price_text1}>1st Prize</Text>
               <View style = {styles.first_price_coin_view}>
                 <Image source = {require("@Resources/Images/token.png")}>
                 </Image>
                 <Text style={styles.first_price_coin_text}>{raffleWinners1Prize}</Text>
               </View>
            </View>
           </View>

        <View style={styles.seperator}/>

          {raffleWinners2Prize !='0' &&
            <View style = {styles.other_price_container__main_view}>
              <View style = {styles.other_price_container_view}>
                  <Image source = {require("@Resources/Images/rank.png")}>
                    <Text style={styles.other_price_text}>2</Text>
                  </Image>
                  <View style = {styles.other_price_text_view}>
                     <Text style={styles.first_price_text1}>2nd Prize</Text>
                   <View style = {styles.other_price_coin_view}>
                      <Image source = {require("@Resources/Images/token-copy-3.png")}>
                      </Image>
                      <Text style={styles.other_price_coin_text}>{raffleWinners2Prize}</Text>
                </View>
              </View>
             </View>

             {raffleWinners3Prize !='0' &&
             <View style = {styles.other_price_container_view}>
                    <Image source = {require("@Resources/Images/rank.png")}>
                      <Text style={styles.other_price_text}>2</Text>
                    </Image>
                    <View style = {styles.other_price_text_view}>
                       <Text style={styles.first_price_text1}>3rd Prize</Text>
                     <View style = {styles.other_price_coin_view}>
                        <Image source = {require("@Resources/Images/token-copy-3.png")}>
                        </Image>
                        <Text style={styles.other_price_coin_text}>{raffleWinners3Prize}</Text>
                  </View>
                </View>
                </View>
             }
             </View>

          }

        {raffleWinners4Prize != '0' &&
          <View style = {styles.other_price_container__main_view}>
              <View style = {styles.other_price_container_view}>
                  <Image source = {require("@Resources/Images/rank.png")}>
                    <Text style={styles.other_price_text}>2</Text>
                  </Image>
                  <View style = {styles.other_price_text_view}>
                     <Text style={styles.first_price_text1}>4th Prize</Text>
                   <View style = {styles.other_price_coin_view}>
                      <Image source = {require("@Resources/Images/token-copy-3.png")}>
                      </Image>
                      <Text style={styles.other_price_coin_text}>{raffleWinners4Prize}</Text>
                </View>
              </View>
             </View>
             {raffleWinners5Prize != '0' &&
               <View style = {styles.other_price_container_view}>
                   <Image source = {require("@Resources/Images/rank.png")}>
                     <Text style={styles.other_price_text}>2</Text>

                   </Image>
                   <View style = {styles.other_price_text_view}>
                      <Text style={styles.first_price_text1}>5th Prize</Text>
                    <View style = {styles.other_price_coin_view}>
                       <Image source = {require("@Resources/Images/token-copy-3.png")}>
                       </Image>
                       <Text style={styles.other_price_coin_text}>{raffleWinners5Prize}</Text>
                 </View>
               </View>
               </View>
             }

             </View>
          }

         </View>

          </View>
        </ScrollView>
      </View>

    )
  }
}
RaffleNotification.propTypes = {
  source: React.PropTypes.number,
  children: React.PropTypes.object,
  style: React.PropTypes.object
}
export default RaffleNotification
