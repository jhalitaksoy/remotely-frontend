var mediaConstraints = {
    audio: false, // We dont want an audio track
    video: true // ...and we want a video track
};


export let dataChannel = {}

let instance;

const ChannelSDPAnswer = "sdp_answer"
const ChannelSDPOffer = "sdp_offer"
const ChannelICE = "ice"

export class StreamController {

    constructor() {
        this.listenMessages()
        this.sended = false;
    }

    async listenMessages() {
        window.rtmt.listenMessage(ChannelSDPOffer, (message) => {
            this.onSdpOfferMessage(this, message)
        })

        window.rtmt.listenMessage(ChannelSDPAnswer, (message) => {
            this.onSdpAnswerMessage(this, message)
        })

        window.rtmt.listenMessage(ChannelICE, (message) => {
            //this.onICEMessage(this, message)
        })
    }

    async onSdpOfferMessage(_this, message) {
        console.log("onSdpOfferMessage");
        const textDecoder = new TextDecoder("utf-8")
        let json = textDecoder.decode(message)
        const remoteSDP = JSON.parse(json)
        await _this.pc.setRemoteDescription(remoteSDP)

        const sdp = await _this.pc.createAnswer()
        _this.pc.setLocalDescription(sdp)

        json = JSON.stringify(sdp)
        console.log(json)
        const textEncoder = new TextEncoder("utf-8")
        const sdpBytes = textEncoder.encode(json)
        window.rtmt.sendMessage(ChannelSDPAnswer, sdpBytes)
    }

    async onSdpAnswerMessage(_this, message) {
        console.log("onSdpAnswerMessage");
        const textDecoder = new TextDecoder("utf-8")
        let json = textDecoder.decode(message)
        const remoteSDP = JSON.parse(json)
        await _this.pc.setRemoteDescription(remoteSDP)
    }

    async sendOffer() {
        console.log("Sending Offer");
        const sdp = await this.pc.createOffer()
        this.pc.setLocalDescription(sdp)

        const json = JSON.stringify(sdp)
        const textEncoder = new TextEncoder("utf-8")
        const sdpBytes = textEncoder.encode(json)
        window.rtmt.sendMessage(ChannelSDPOffer, sdpBytes)
    }

    async onICEMessage(_this, message) {
        console.log("OnICEMesssage");
        const textDecoder = new TextDecoder("utf-8")
        let iceCandidateText = textDecoder.decode(message)
        const iceCandidateInit = JSON.parse(iceCandidateText)
        if (iceCandidateInit.candidate != null) {
            await _this.pc.addIceCandidate(iceCandidateInit)
        }
    }

    handleICECandidate(username) {
        return async function (event) {
            console.log({ "ICECandidate ": event.candidate });
            if (event.candidate) {
                console.log("candidate send");
                const textEncoder = new TextEncoder("utf-8")
                const iceBytes = textEncoder.encode(JSON.stringify(event.candidate))
                window.rtmt.sendMessage(ChannelICE, iceBytes)
            } else {
                if (!instance.sended) {
                    instance.sended = true;
                    instance.sendOffer()
                }

            }
        }
    }

    async start(roomid, setOnlineStatus) {
        this.pc = this.createPC();
        this.handleConnectionStatus(setOnlineStatus)
        this.video = document.getElementById("id_video");
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
            console.log("error " + event);
        });
        pc.addEventListener("error", (event) => {
            console.log({ err: event });
        });
        pc.onnegotiationneeded = function () {
            console.log("onnegotiationneeded")
        }
        return pc
    }

    async publish(micstate) {
        this.pc.onicecandidate = this.handleICECandidate("Publisher");
        this.pc.addTransceiver('audio', { 'direction': 'recvonly' });
        this.pc.ontrack = this.handleTrack;

        this.createDataChannel(this.pc)

        try {
            await this.startMedia(this.pc, micstate)
            return instance.createOffer()
        } catch (error) {
            console.log(error)
        }
    }

    async join(micstate) {
        let timestamp = Date.now();
        let rnd = Math.floor(Math.random() * 1000000000);
        let id = "Client:" + timestamp.toString() + ":" + rnd.toString()

        this.pc.onicecandidate = this.handleICECandidate(id);
        this.pc.onnegotiationneeded = async () => {
            /*console.log("onnegotiationneeded");
            try {
                const offer = await this.createOffer(instance.pc)
                let msg = {
                    Name: "Client",
                    SD: offer
                };
                window.rtmt.sendMessage(ChannelSDPAnswer, JSON.stringify(msg))
                //await instance.pc.setRemoteDescription(new RTCSessionDescription(sdp))
            }
            catch (e) {
                console.log(e)
            }*/
        }

        this.pc.addTransceiver('video', { 'direction': 'recvonly' });
        this.pc.addTransceiver('audio', { 'direction': 'recvonly' });
        this.pc.addTransceiver('audio', { 'direction': 'recvonly' });
        this.pc.addTransceiver('audio', { 'direction': 'recvonly' });
        this.pc.ontrack = this.handleTrack;

        this.createDataChannel(this.pc)

        await this.createAudioStream(this.pc, micstate)

        this.createOffer(this.pc)
    }

    createDataChannel(pc) {
        // todo : looklater
        var id = 0
        let dataChannel = pc.createDataChannel(id)
        this.dataChannel = dataChannel
        //look later 
        //window.rtmt.setDataChannel(dataChannel)
    }

    handleConnectionStatus(setOnlineStatus) {
        this.pc.onconnectionstatechange = ev => {
            setOnlineStatus(this.pc.connectionState)
        }
    }

    handleTrack(event) {
        var mediaStreamTrack = event.streams[0]
        if (mediaStreamTrack) {
            if (mediaStreamTrack.id === 'video') {
                console.log("Received video track");
                let el = document.getElementById('id_video');
                el.srcObject = mediaStreamTrack
                el.autoplay = true
            } else if (event.streams[0].id === 'audio') {
                const audioBox = document.querySelector('audio#audioBox')
                console.log("Received audio track");
                audioBox.srcObject = event.streams[0];
            }
        }

    }

    instance() {
        return this;
    }

    async createAudioStream(pc, micstate) {
        const streamAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        streamAudio.getTracks().forEach(track => pc.addTrack(track, streamAudio))
        this.streamAudio = streamAudio;
        if (micstate === true) {
            this.resumeAudioSend()
        } else {
            this.pauseAudioSend()
        }
    }

    pauseAudioSend() {
        this.streamAudio.getTracks().forEach(track => track.enabled = false)
    }

    resumeAudioSend() {
        this.streamAudio.getTracks().forEach(track => track.enabled = true)
    }

    async startMedia(pc, micstate) {
        try {
            await this.createAudioStream(pc, micstate)

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
        return offer
    }


    handleICEConnectionStateChange(event) {
        console.log("ICEConnectionStateChange: " + instance.pc.iceConnectionState)
    };


    async sendToServer(url, msg) {
        try {
            const jwt = window.jwtKey()
            let headers = {
                'Content-Type': 'text/plain; charset=utf-8',
            }
            if (jwt) {
                headers['Authorization'] = "Bearer " + jwt
            }
            let response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: msg
            })
            // Verify HTTP-status is 200-299
            let json
            if (response.ok) {
                if (response.headers.get('Content-Type') === "application/json; charset=utf-8") {
                    json = await response.json();
                } else {
                    throw new Error("Content-Type expected `application/json; charset=utf-8` but got " + response.headers.get('Content-Type'))
                }
            } else {
                throw new HttpError(response);
            }
            return json.SD
        }
        catch (e) {
            console.log(e);
        }
    }

    // pc.onnegotiationneeded = handleNegotiationNeeded;
    // function handleNegotiationNeeded(){
    // };

    handleGetUserMediaError(e) {
        switch (e.name) {
            case "NotFoundError":
                console.log("Unable to open your call because no camera and/or microphone" +
                    "were found.");
                break;
            case "SecurityError":
            case "PermissionDeniedError":
                // Do nothing; this is the same as the user canceling the call.
                break;
            default:
                console.log("Error opening your camera and/or microphone: " + e.message);
                break;
        }
    }

    cancel() {
        instance.pc.close();
        if (instance.stream) {
            instance.stream.getTracks().forEach(track => track.stop());
        }
    }
}

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}