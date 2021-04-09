const CHANNEL_LABEL_MENU = 'SPACEX_ROYALE_MENU_CHANNEL';
const CHANNEL_LABEL_GAME = 'SPACEX_ROYALE_GAME_CHANNEL';

  // IMPLEMENT DISCONNECT CONTROLLER?
  // peerConnection.oniceconnectionstatechange = () => {
  //   if (peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'disconnected') {
  //     createOffer();
  //   }
  // };

class HostController {
    constructor(onOpen = ()=>{console.log('connected')},onReceive = (data)=>{console.log(data)}) {
        this.peerConnection = new RTCPeerConnection({iceServers:[
            {
                urls: 'stun:stun.l.google.com:19302',
            },
            {
                /*
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
                */
                urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                username: 'webrtc',
                credential: 'webrtc',
                
            }
        ]});
        this.uploadedDescription=false;
        this.menuchannel = this.peerConnection.createDataChannel(CHANNEL_LABEL_MENU, {ordered: true});
        this.menuchannel.onopen = () => {onOpen()};
        this.menuchannel.onmessage = (event) => {onReceive(event.data)};
        this.gamechannel = this.peerConnection.createDataChannel(CHANNEL_LABEL_GAME, {ordered: false, maxPacketLifeTime: 500});
        this.peerConnection.onicecandidate = (e) => {
            if (this.uploadedDescription) return;
            this.uploadedDescription=true;
            this.uploadDescription().then(()=>{setTimeout(()=>{this.getRemoteDescription()},10000)});
        };
        this.ID = this.randomString(10);
        this.createOffer();
    }
    async getRemoteDescription() {
        console.log('Trying to get remote description...');
        await fetch(`https://script.google.com/macros/s/AKfycbzYYu9_Yn-mNs_5zk9i8JhJtmd6RCBzxJ9HsgPYmgE3blfd6xqLes_BJA/exec?ID=${this.ID}&query=slaveDescription`, {
            method: 'GET'
        }).then(response=>response.json())
        .then(response => {
            if (response.data == '') setTimeout(()=>{this.getRemoteDescription()},4000);
            else {
                this.setRemoteDescription(response.data);
                console.log('Got remote description');
            }
        }).catch(err => {
            console.log("Error:" + err);
        });
    }
    async uploadDescription() {
        let desc = JSON.stringify(this.peerConnection.localDescription);
        console.log('Trying to upload local description...');
        await fetch(`https://script.google.com/macros/s/AKfycbzYYu9_Yn-mNs_5zk9i8JhJtmd6RCBzxJ9HsgPYmgE3blfd6xqLes_BJA/exec?ID=${this.ID}&data=hostDescription`, {
            method: 'POST',
            mode: 'no-cors',
            body: desc,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }).then(()=>{
            console.log('Uploaded local description');
        }).catch(err => {
            console.log("Error:" + err);
        });
    }
    async createOffer() {
        const description = await this.peerConnection.createOffer();
        this.peerConnection.setLocalDescription(description);
    }
    setRemoteDescription(desc) {
        this.peerConnection.setRemoteDescription(JSON.parse(desc));
    }
    randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

class SlaveController {
    constructor(ID,onOpen = ()=>{console.log('connected')},onReceive = (data)=>{console.log(data)}) {
        this.peerConnection = new RTCPeerConnection({iceServers:[
            {
                urls: 'stun:stun.l.google.com:19302',
            },
            {
                /*
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
                */
                urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                username: 'webrtc',
                credential: 'webrtc',
                
            }
        ]});
        this.uploadedDescription=false;
        this.peerConnection.ondatachannel = ({channel}) => {
            if (channel.label == CHANNEL_LABEL_MENU) {
                channel.onopen = () => {onOpen()};
                channel.onmessage = (event) => {onReceive(event.data)};
                this.menuchannel = channel;
            } else {
                this.gamechannel = channel;
            }
        };
        this.peerConnection.onicecandidate = (e) => {
            if (this.uploadedDescription) return;
            this.uploadedDescription=true;
            this.uploadDescription();
        };
        this.ID = ID;
        this.getRemoteDescription().then(()=>{this.connect()});
    }
    async getRemoteDescription() {
        console.log('Trying to get remote description...');
        await fetch(`https://script.google.com/macros/s/AKfycbzYYu9_Yn-mNs_5zk9i8JhJtmd6RCBzxJ9HsgPYmgE3blfd6xqLes_BJA/exec?ID=${this.ID}&query=hostDescription`, {
            method: 'GET'
        }).then(response=>response.json())
        .then(response => {
            this.remoteDescription = JSON.parse(response.data);
            console.log('Got remote description');
        }).catch(err => {
            console.log("Error:" + err);
        });
    }
    async uploadDescription() {
        let desc = JSON.stringify(this.peerConnection.localDescription);
        console.log('Trying to upload local description...');
        await fetch(`https://script.google.com/macros/s/AKfycbzYYu9_Yn-mNs_5zk9i8JhJtmd6RCBzxJ9HsgPYmgE3blfd6xqLes_BJA/exec?ID=${this.ID}&data=slaveDescription`, {
            method: 'POST',
            mode: 'no-cors',
            body: desc,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }).then(()=>{
            console.log('Uploaded local description.');
        }).catch(err => {
            console.log("Error:" + err);
        });
    }
    async connect() {
        await this.peerConnection.setRemoteDescription(this.remoteDescription);
        const description = await this.peerConnection.createAnswer();
        this.peerConnection.setLocalDescription(description);
    }
}

