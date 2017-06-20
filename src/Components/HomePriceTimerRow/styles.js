import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');
const ASPECT_RATIO = screenWidth / screenHiehgt;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    height: 76,
    paddingHorizontal: 17,
    backgroundColor: 'rgba(69, 149, 250, 0.9)',
    shadowColor:'rgba(0, 0, 0, 0.24)',
    shadowOffset:{
      width: 0,
      height: 3,
    },
    shadowOpacity:5,
    shadowRadius:5,
  },
  topCellContainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  topPaddingContainer: {
    width: 16,
  },
  textFieldName:{
    fontFamily: 'Exo-DemiBold',
    height: 21,
    fontSize: 16,
    color: '#fff',

  },
  fieldNameContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCurrentPrize: {
    fontFamily: 'Exo-Bold',
    fontSize: 30,
    color: '#fcea61',
    marginLeft: 5,
  },
  timeFieldContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTimeValue: {
    fontFamily: 'Exo-Bold',
    fontSize: 20,
    color: '#fff',
    height: 27,
  },
  textTimeLabel: {
    fontFamily: 'Exo-Medium',
    fontSize: 8,
    color: '#929497',
  },
});

export default styles;
