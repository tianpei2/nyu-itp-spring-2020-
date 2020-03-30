import { ReactMic } from 'react-mic';
import React from 'react';
import Button from "@material-ui/core/Button";



export class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    }
  }

  startRecording = () => {
    this.setState({ record: true });
  }

  stopRecording = () => {
    this.setState({ record: false });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#1a53b0" />
        <Button onTouchTap={this.startRecording} type="button">Record</Button>
      <Button onTouchTap={this.stopRecording} type="button">Stop</Button>
      </header>
    </div>
    );
  }
}

export default Example;
