import React, { Component } from 'react'
import { Image,View,TouchableOpacity,Text } from 'react-native'
import styles from './styles'
import BackgroundTimer from 'react-native-background-timer';

class PriceTimer extends Component {

constructor(props){
  super(props)
  this.state = {
    TimeToRaffleHours:'00',
    TimeToRaffleMinutes:'00',
    TimeToRaffleSeconds:'00',
  };
}
componentWillMount() {
  this.StartRaffleTimer();
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

  render() {
    const {source, children, style, ...props} = this.props
    return (
      <View style={ styles.topContainer }>
        <View style={ styles.topCellContainer }>
          <Text style={ styles.textFieldName }>Current Prize</Text>
          <View style={ styles.fieldNameContainer }>
            <Image source={ require("@Resources/Images/token.png") } style={ styles.imageToken }/>
            <Text style={ styles.textCurrentPrize }>3000</Text>
          </View>
        </View>
        <View style={ styles.topPaddingContainer }/>
        <View style={ styles.topCellContainer }>
          <Text style={ styles.textFieldName }>Time To Raffle</Text>
          <View style={ [styles.fieldNameContainer, { justifyContent: 'space-around' }] }>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{this.state.TimeToRaffleHours}</Text>
              <Text style={ styles.textTimeLabel }>HRS</Text>
            </View>
            <View>
              <Text style={ styles.textTimeValue }>:</Text>
              <Text style={ styles.textTimeLabel }></Text>
            </View>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{this.state.TimeToRaffleMinutes}</Text>
              <Text style={ styles.textTimeLabel }>MNS</Text>
            </View>
            <View>
              <Text style={ styles.textTimeValue }>:</Text>
              <Text style={ styles.textTimeLabel }></Text>
            </View>
            <View style={ styles.timeFieldContainer }>
              <Text style={ styles.textTimeValue }>{this.state.TimeToRaffleSeconds}</Text>
              <Text style={ styles.textTimeLabel }>SEC</Text>
            </View>
          </View>
        </View>
      </View>

    )
  }
}

PriceTimer.propTypes = {
  source: React.PropTypes.number,
  children: React.PropTypes.object,
  style: React.PropTypes.object
}
export default PriceTimer
