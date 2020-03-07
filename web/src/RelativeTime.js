import Moment from 'react-moment';
import React, {Component} from 'react';

function RelativeTime ({time}) {
  return (
    <div>
      <Moment parse="LLL" fromNow>{time}</Moment>
    </div>)
}

export default RelativeTime;
