import React, { Component } from 'react'
import { Image,View } from 'react-native'
import styles from './styles'

class BackgroundImage extends Component {
  render() {
    const {source, children, style, ...props} = this.props
    return (
      <View style={{flexGrow:1}}>
      <Image source={ source }
             style={[styles.image_style, {...style}]}
             {...props}>
        { children }
      </Image>
    </View>
    )
  }
}
BackgroundImage.propTypes = {
  source: React.PropTypes.number,
  children: React.PropTypes.object,
  style: React.PropTypes.object
}
export default BackgroundImage
