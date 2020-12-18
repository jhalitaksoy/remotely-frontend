// this code works the modern way
"use strict";

import { serverUrl } from "../service/NetworkService";
import { currentUser } from "./UserController";

var mediaConstraints = {
    audio: false, // We dont want an audio track
    video: true // ...and we want a video track
};

// Get the canvas element using the DOM
// let video = document.createElement('video');
// video.id="id_v";
// video.autoplay = true;
// document.body.appendChild(video);
// document.getElementById("id_v").style="visibility:hidden"; 
// object to hold video and associated info


let instance;

export class StreamController {
    start(roomid, setOnlineStatus) {
        this.pc = this.createPC();
        this.handleConnectionStatus(setOnlineStatus)
        this.canvas = document.getElementById('id_canvas');
        //this.ctx = this.canvas.getContext('2d')
        this.video = document.getElementById("id_video");
        // set the event to the play function that can be found below
        //this.video.oncanplay = this.readyToPlayVideo;
        this.videoContainer = {
            video: this.video,
            ready: false,
        };
        this.roomid = roomid
        instance = this;
    }

    createPC() {
        let pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                }
            ]
        })
        pc.oniceconnectionstatechange = this.handleICEConnectionStateChange;
        pc.addEventListener("icecandidateerror", (event) => {
            console.log(event);
        });
        pc.addEventListener("error", (event) => {
            console.log({ err: event });
        });
        return pc
    }

    publish() {
        this.pc.onicecandidate = this.handleICECandidate("Publisher");

        // todo : WTF
        var id = 0

        let sendChannel = this.pc.createDataChannel(id)
        sendChannel.onclose = () => console.log('sendChannel has closed')
        sendChannel.onopen = () => {
            this.sendChannel = sendChannel
            console.log('sendChannel has opened');
        }
        sendChannel.onmessage = this.onMessage
        sendChannel.addEventListener("error", ev => {
            console.log({ datachannel_error: ev });
        })

        // Start acquisition of media
        this.startMedia(this.pc)
            .then(function () {
                return instance.createOffer()
            })
            .catch(log)
    }

    join() {
        let timestamp = Date.now();
        let rnd = Math.floor(Math.random() * 1000000000);
        let id = "Client:" + timestamp.toString() + ":" + rnd.toString()

        this.pc.onicecandidate = this.handleICECandidate(id);

        this.pc.addTransceiver('video', { 'direction': 'recvonly' });
        this.pc.addTransceiver('audio', { 'direction': 'recvonly' });
        this.pc.ontrack = this.handleTrack;

        let sendChannel = this.pc.createDataChannel(id)
        sendChannel.onclose = () => console.log('sendChannel has closed')
        sendChannel.onopen = () => {
            this.sendChannel = sendChannel
            console.log('sendChannel has opened');
        }
        sendChannel.onmessage = this.onMessage
        sendChannel.addEventListener("error", ev => {
            console.log({ datachannel_error: ev });
        })

        this.createOffer(this.pc);
    }

    handleConnectionStatus(setOnlineStatus) {
        this.pc.onconnectionstatechange = ev => {
            setOnlineStatus(this.pc.connectionState)
        }
    }

    handleTrack(event) {
        if (event.streams[0].id == 'video') {
            let el = document.getElementById('id_video');
            el.srcObject = event.streams[0]
            el.autoplay = true
            el.controls = true
        } else if (event.streams[0].id == 'audio') {
            const audioBox = document.querySelector('audio#audioBox')
            console.log({ audioBox });
            audioBox.srcObject = event.streams[0];
        }
    }

    instance() {
        console.log({ canvas: this });
        return this;
    }

    readyToPlayVideo(event) {
        // the video may not match the canvas size so find a scale to fit
        instance.videoContainer.scale = Math.min(
            this.width / this.videoWidth,
            this.height / this.videoHeight);
        let scale = instance.videoContainer.scale;
        let vidH = instance.videoContainer.video.videoHeight * scale;
        let vidW = instance.videoContainer.video.videoWidth * scale;
        let top = instance.canvas.height / 2 - (vidH / 2);
        let left = instance.canvas.width / 2 - (vidW / 2);
        // the video can be played so hand it off to the display function
        instance.draw(top, left, vidH, vidW)
    }

    draw(top, left, vidH, vidW) {
        let updateCanvas = function () {
            // only draw if loaded and ready
            if (instance.videoContainer !== undefined && instance.videoContainer.ready) {
                //let json = videoContainer.json;
                // now just draw the video the correct size
                instance.ctx.drawImage(instance.videoContainer.video, left, top, vidW, vidH);
                //drawRectangle(ctx, json.x, json.y, json.width, json.height);
                //drawText(ctx, json.text);
            }
            // all done for display 
            // request the next frame in 1/60th of a second
            requestAnimationFrame(updateCanvas);
        }
        requestAnimationFrame(updateCanvas);
    }

    onMessage(e) {
        let json = JSON.parse(instance.ab2str(e.data));
        if (instance.onChatMessage) {
            instance.onChatMessage(json)
        }
        instance.videoContainer.json = json
        instance.videoContainer.ready = true;
    }

    //Convert object array buffer to string 
    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    async startMedia(pc) {
        try {
            const streamAudio = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })//.then(handleSuccess).catch(handleError);
            streamAudio.getTracks().forEach(track => pc.addTrack(track, streamAudio));

            const streamVideo = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
            document.getElementById("id_video").srcObject = streamVideo;
            streamVideo.getTracks().forEach(track => pc.addTrack(track, streamVideo));
            instance.stream = streamVideo
        }
        catch (e) {
            console.log(e);
            return this.handleGetUserMediaError(e);
        }
    }

    async createOffer(pc) {
        let offer = await instance.pc.createOffer()
        await instance.pc.setLocalDescription(offer)
    }

    handleICECandidate(username) {
        return async function (event) {
            try {
                log("ICECandidate: " + event.candidate)
                if (event.candidate === null) {
                    //document.getElementById('finalLocalSessionDescription').value = JSON.stringify(pc.localDescription)
                    let msg = {
                        Name: username,
                        SD: instance.pc.localDescription
                    };
                    let sdp = await instance.sendToServer(serverUrl() + "/stream/sdp/" + instance.roomid, JSON.stringify(msg))
                    console.log(sdp)
                    await instance.pc.setRemoteDescription(new RTCSessionDescription(sdp))
                }
            }
            catch (e) {
                log(e)
            }
        }
    }

    async sendToServer(url, msg) {
        try {
            const user = currentUser()
            const id = parseInt(user.id)
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'userid': id
                },
                body: msg
            })
            // Verify HTTP-status is 200-299
            let json
            if (response.ok) {
                if (response.headers.get('Content-Type') == "application/json; charset=utf-8") {
                    json = await response.json();
                } else {
                    throw new Error("Content-Type expected `application/json; charset=utf-8` but got " + response.headers.get('Content-Type'))
                }
            } else {
                throw new HttpError(response);
            }
            //document.getElementById('remoteSessionDescription').value = JSON.stringify(json.SD)
            return json.SD
        }
        catch (e) {
            log(e);
        }
    }

    // Set the handler for ICE connection state
    // This will notify you when the peer has connected/disconnected
    handleICEConnectionStateChange(event) {
        log("ICEConnectionStateChange: " + instance.pc.iceConnectionState)
    };

    // pc.onnegotiationneeded = handleNegotiationNeeded;
    // function handleNegotiationNeeded(){
    // };

    handleGetUserMediaError(e) {
        switch (e.name) {
            case "NotFoundError":
                log("Unable to open your call because no camera and/or microphone" +
                    "were found.");
                break;
            case "SecurityError":
            case "PermissionDeniedError":
                // Do nothing; this is the same as the user canceling the call.
                break;
            default:
                log("Error opening your camera and/or microphone: " + e.message);
                break;
        }
    }

    cancel() {
        instance.pc.close();
        if (instance.stream) {
            instance.stream.getTracks().forEach(track => track.stop());
        }
    }

    sendChatMessage(message) {
        this.sendChannel.send(JSON.stringify(message))
    }
}

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

var log = msg => {
    console.log(msg);
    //document.getElementById('logs').innerHTML += msg + '<br>'
}

window.addEventListener('unhandledrejection', function (event) {
    // the event object has two special properties:
    // alert(event.promise); // [object Promise] - the promise that generated the error
    // alert(event.reason); // Error: Whoops! - the unhandled error object
    alert("Event: " + event.promise + ". Reason: " + event.reason);
});
