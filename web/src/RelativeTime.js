import Moment from 'react-moment';
import React, {Component} from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

function RelativeTime ({time}) {
  return (
    <div>
      <AccessTimeIcon fontSize="small" color="primary"/>
    Last played <Moment parse="LLL" fromNow>{time}</Moment>
    </div>)
}

export default RelativeTime;
