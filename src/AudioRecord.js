import React from "react";
import MicRecorder from "mic-recorder-to-mp3";
import Button from "@material-ui/core/Button";
import { ReactMic } from "react-mic";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudioRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: "",
    };
  }

  start = () => {
    Mp3Recorder.start()
      .then(() => {
        this.setState({ isRecording: true });
      })
      .catch((e) => console.error(e));
  };

  stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        this.setState({ blobURL, isRecording: false });
        this.props.setFiles(blob);
      })
      .catch((e) => console.log(e));
  };

  render() {
    return (
      <div className={"container example"}>
        <ReactMic
          record={this.state.isRecording}
          className="sound-wave"
          strokeColor="#FF4081"
        />
        <Button onClick={this.start} disabled={this.state.isRecording}>
          Record
        </Button>
        <Button onClick={this.stop} disabled={!this.state.isRecording}>
          Stop
        </Button>
        <audio
          src={this.state.blobURL}
          id="aud"
          controls="controls"
          style={{ width: 200 }}
        />
      </div>
    );
  }
}

export default AudioRecord;
