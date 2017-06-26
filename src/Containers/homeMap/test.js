{this.state.isCalculatedResult &&
      <MapView.Polyline coordinates={[ ...this.state.routePolylines,]}
                strokeWidth={4}
                strokeColor="orange"
                fillColor="rgba(255,0,0,0.5)"
        />
}

{!this.state.isDriverApp && !this.state.isDestinationRouteDraw &&
            <MapView.Marker
                title='Your location'
                coordinate={ this.state.currentLocation }
                pinColor='#4595fa'
              />
    }

  {this.state.isDestinationRouteDraw &&
             <MapView.Marker
                 title= { this.state.destinationAddress }
                  coordinate={ this.state.destinationLocation }
                 pinColor='orange'
               />
     }

{!this.state.isDriverApp && this.state.rideStartAndPickedUp &&
   <MapView.Polyline coordinates={[ ...this.state.rideStartRoutePolyline,]}
           strokeWidth={4}
           strokeColor="orange"
           fillColor="rgba(255,0,0,0.5)"
     />
 }
 {!this.state.isDriverApp && this.state.rideStartAndPickedUp && this.state.driverPickUpSource !='' &&
   <MapView.Marker
         title= 'Driver'
         coordinate={ this.state.driverCurrentLocation }
         image={require("@Resources/Images/driver-car.png")}
  />
}
{!this.state.isDriverApp && this.state.rideStartAndPickedUp && this.state.currentLocation !='' &&
  <MapView.Marker
        title= 'Your location'
        coordinate={ this.state.currentLocation }
       pinColor='blue'
 />
}

{!this.state.isDriverApp  && this.state.rideStartAndPickedUp && this.state.destinationLocation !='' &&
 <MapView.Marker
     title= { this.state.destinationAddress }
     coordinate={ this.state.destinationLocation }
     pinColor='orange'

/>
}

{!this.state.isDriverApp  && this.state.riderWaitingForPickUp &&
     <MapView.Polyline coordinates={[ ...this.state.rideStartRoutePolyline,]}
             strokeWidth={4}
             strokeColor="orange"
             fillColor="rgba(255,0,0,0.5)"
       />
}

{!this.state.isDriverApp && this.state.riderWaitingForPickUp && this.state.driverPickUpSource !='' &&
    <MapView.Marker
          title= 'Driver'
          coordinate={ this.state.driverCurrentLocation }
          image={require("@Resources/Images/driver-car.png")}
   />
}

{!this.state.isDriverApp && this.state.riderWaitingForPickUp && this.state.currentLocation !='' &&
     <MapView.Marker
           title= 'Your Location'
           coordinate={ this.state.currentLocation }
           pinColor='blue'
    />
}

{!this.state.isDriverApp && this.state.riderWaitingForPickUp && this.state.destinationLocation !='' &&
      <MapView.Marker
          title= { this.state.destinationAddress }
          coordinate={ this.state.destinationLocation }
          pinColor='orange'
     />
}




{!this.state.isDriverApp && !this.state.isDestinationRouteDraw &&
<MapView.Marker
    title='Your location'
    coordinate={ this.state.currentLocation }
    pinColor='#4595fa'
  />
}
{this.state.driverRideRequest &&
     <MapView.Polyline coordinates={[ ...this.state.riderRequestPolyline,]}
               strokeWidth={4}
               strokeColor="orange"
               fillColor="rgba(255,0,0,0.5)"
         />
   }

{this.state.driverRideRequest && this.state.driverPickUpDestination !='' &&
   <MapView.Marker
           title= { this.state.driverPickUpDestinationAddress }
           coordinate={ this.state.driverPickUpDestination }
           pinColor='orange'
     />
   }

{this.state.driverRideRequest && this.state.driverPickUpSource !='' &&
     <MapView.Marker
             title= { this.state.driverPickUpSourceAddress }
             coordinate={ this.state.driverPickUpSource }
             pinColor='#4595fa'
       />
   }

{this.state.driverCurrentLocation !='' && this.state.isDriverApp &&
     <MapView.Marker
             title= 'Your Location'
             coordinate={ this.state.driverCurrentLocation }
             image={require("@Resources/Images/driver-car.png")}
     />
 }
