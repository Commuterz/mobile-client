import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView} from 'react-native';
import styles from './styles'
import BackgroundImage from '@Components/BackgroundImage'
import BackgroundTimer from 'react-native-background-timer';

var time ='';
class RaffleNotification extends Component
{
  constructor(props){
    super(props)
    this.state = {
      TimeToRaffleHours:'00',
      TimeToRaffleMinutes:'00',
      TimeToRaffleSeconds:'00',
    };
  }
  componentWillMount() {

    //this.StartRaffleTimer();
  }

  calculateTimerValue()
  {
      var timeEnd = new Date();
      var timeStart = new Date();
      timeEnd.setDate(timeStart.getDate() + (3 + 7 - timeStart.getDay()) % 7);
      timeEnd.setHours (23);
      timeEnd.setMinutes (59);
      timeEnd.setSeconds (59);
      // Calculate the difference in milliseconds
      var difference_ms = timeEnd - timeStart;
      //alert(difference_ms);
      //take out milliseconds
      difference_ms = difference_ms/1000;
      var seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60;
      var minutes = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60;
      var hours = Math.floor(difference_ms);
      //var days = Math.floor(difference_ms/24);
      this.setState({
        TimeToRaffleHours : hours.toString(),
        TimeToRaffleMinutes : minutes.toString(),
        TimeToRaffleSeconds : seconds.toString(),
      });
  }

   StartRaffleTimer()
    {

      // Start a timer that runs continuous after X milliseconds
      const intervalId = BackgroundTimer.setInterval(() => {
          // this will be executed every 200 ms
          // even when app is the the background
          this.calculateTimerValue();
      }, 1000);
    }

  render()
  {
    const {TimeToRaffleHours,TimeToRaffleMinutes,TimeToRaffleSeconds,rafflePoolSize,raffleWinners1Prize,raffleWinners2Prize,raffleWinners3Prize,
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
        <ScrollView>
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
        <View style = {styles.bottom_view}>
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
            <View style = {styles.other_price_container_view}>
              <Image source = {require("@Resources/Images/rank.png")}>
                <Text style={styles.other_price_text}>3</Text>
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
          </View>
          <View style = {styles.other_price_container__main_view}>
            <View style = {styles.other_price_container_view}>
              <Image source = {require("@Resources/Images/rank.png")}>
                <Text style={styles.other_price_text}>4</Text>
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
            <View style = {styles.other_price_container_view}>
              <Image source = {require("@Resources/Images/rank.png")}>
                <Text style={styles.other_price_text}>5</Text>
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
