import React, {Component} from "react";
import AudioAnalyser from "react-audio-analyser";
import {Container, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import StopIcon from '@material-ui/icons/Stop';

export default class audiorecord extends Component {


    constructor(props) {
        super(props)
        this.state = {
            status: ""
        }
    }

    componentDidMount() {
    }

    controlAudio(status) {
        this.setState({
            status
        }, () => {
            console.log("status", this.state)
        })
    }

    changeScheme(e) {
        this.setState({
            audioType: e.target.value
        })
    }



    render() {
        const {status, audioSrc, audioType, audioBlob} = this.state;
        const audioProps = {
            audioType,
            status,
            audioSrc,
            audioBlob,
            timeslice: 1000,
            startCallback: (e) => {
                console.log("succ start", e)
            },
            pauseCallback: (e) => {
                console.log("succ pause", e)
            },
            stopCallback: (e) => {
                this.setState({
                    audioSrc: window.URL.createObjectURL(e),
                    audioBlob: e
                })
                console.log("succ stop", e)
            },
            onRecordCallback: (e) => {
                console.log("recording", e)
            },
            errorCallback: (err) => {
                console.log("error", err)
            }
        }
        return (
          <div>
            <Container component="main" maxWidth="sm">

              <AudioAnalyser {...audioProps} >
                      {status !== "recording" &&
                      <IconButton title="Start"
                         onClick={() => this.controlAudio("recording")}>
                         <PlayCircleOutlineIcon fontSize="large"/></IconButton>}
                      {status === "recording" &&
                      <IconButton title="Pause"
                         onClick={() => this.controlAudio("paused")}>
                       <PauseCircleOutlineIcon fontSize="large"/></IconButton>}
                      <IconButton title="Stop"
                         onClick={() => this.controlAudio("inactive")}>
                         <StopIcon fontSize="large"/></IconButton>
              </AudioAnalyser>

            </Container>

              <Typography component="h1" variant="h5">
                File format:
              </Typography>
              <FormControl fullWidth margin="normal" >
                <select name="" id="" onChange={(e) => this.changeScheme(e)} value={audioType}>
                    <option value="audio/webm">Webm</option>
                  <option value="audio/wav">Wav</option>
                <option value="audio/mp3">Mp3</option>
              </select>
            </FormControl>
          </div>
        );
    }
}
