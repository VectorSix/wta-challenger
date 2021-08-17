/**
 * Jitsi Wrapper
 * This Simple Jitsi Wrapper is using the Jitsi RTC Service to establish a easy way for HTML5 WebCam Meetings.
 * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api
 * https://github.com/jitsi/lib-jitsi-meet/blob/master/doc/example/example.js
 */
const JitsiClient = function (opt) {
   let $this = this;
   let _private = {
      roomPassword: "",
      isConnected: false,
      connection: null,
      room: null,
      members: {},
   };

   let options = {
      prefix: "rushpuppy",
      displayName: opt.name,
      token: null,
      connectionOptions: {
         hosts: {
            domain: "meet.jit.si",
            muc: "conference.meet.jit.si",
         },
         externalConnectUrl: "https://meet.jit.si/http-pre-bind",
         enableP2P: true,
         p2p: {
            enabled: true,
            preferH264: true,
            disableH264: true,
            useStunTurn: true,
         },
         useStunTurn: true,
         bosh: "https://meet.jit.si/http-bind?room=liveroom",
         websocket: "wss://meet.jit.si/xmpp-websocket",
         clientNode: "http://jitsi.org/jitsimeet",
      },
      roomOptions: {},
      trackOptions: {
         devices: ["video", "audio"],
      },
   };

   // Constructor
   this.init = () => {
      window.JitsiMeetJS.setLogLevel(window.JitsiMeetJS.logLevels.ERROR);
      window.JitsiMeetJS.init();
   };

   /**
    * Connect to Jitsi
    */
   this.connect = () => {
      let connection = new JitsiMeetJS.JitsiConnection(null, options.token, options.connectionOptions);
      connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, _private.onConnectionSuccess);
      connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, _private.onConnectionFailed);
      connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, _private.onDisconnect);
      connection.connect();
      _private.connection = connection;
   };

   /**
    * Disconnect
    */
   this.disconnect = () => {
      _private.connection.disconnect();
   };

   /**
    * Jitsi Callback OnConnectionSuccess
    */
   _private.onConnectionSuccess = () => {
      console.log("Jitsi Connection Success");
      _private.isConnected = true;
      $this.connected();
   };

   /**
    * Jitsi Callback OnConnectionFailed
    */
   _private.onConnectionFailed = () => {
      console.log("Jitsi Connection Failed");
      _private.isConnected = false;
   };

   /**
    * Jitsi Callback OnDisconnect
    */
   _private.onDisconnect = () => {
      console.log("Jitsi Disconnect");
      _private.isConnected = false;
      this.disconnected();
   };

   /**
    * Joining a Jitsi Connference
    */
   this.join = (roomName, roomPassword) => {
      if (!_private.isConnected) {
         return false;
      }

      const newRomName = (options.prefix + "_" + roomName).toLowerCase();
      console.log("Jitsi - Join: " + newRomName);

      let room = _private.connection.initJitsiConference(newRomName, options.roomOptions);

      const userId = room.room.myroomjid.split("/")[1];
      _private.addMember(userId);

      room.on(JitsiMeetJS.events.conference.USER_JOINED, _private.onUserJoined);
      room.on(JitsiMeetJS.events.conference.USER_LEFT, _private.onUserLeft);
      room.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, _private.onDisplayNameChanged);
      room.on(JitsiMeetJS.events.conference.USER_ROLE_CHANGED, _private.onUserRoleChanged);
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, _private.onRemoteTrack);
      room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, _private.onRemoteRemoveTrack);
      room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, _private.onConferenceJoined);

      _private.roomPassword = roomPassword;
      room.join(roomPassword);
      _private.room = room;
      return true;
   };

   /**
    * Jitsi Callback onUserJoined
    */
   _private.onUserJoined = (id, user) => {
      console.log("Jitsi - User Joined");

      // Create Remote User
      _private.addMember(id);
      _private.members[id].idRemoteUser = true;
      _private.members[id].isModerator = user._role === "moderator" ? true : false;

      // User SetName Loop
      const wait = () => {
         if (typeof user._displayName === "undefined") {
            setTimeout(wait, 1000);
         } else {
            _private.members[id].displayName = user._displayName;
            $this.render(_private.members);
         }
      };
      wait();
      $this.render(_private.members);
   };

   /**
    * Jitsi Callback onUserLeft
    * @param {*} id
    * @param {*} user
    */
   _private.onUserLeft = (id, user) => {
      delete _private.members[id];
      $this.render(_private.members);
   };

   /**
    * On DisplayName Changed
    * @param {*} id
    * @param {*} displayName
    */
   _private.onDisplayNameChanged = (id, displayName) => {
      _private.members[id].displayName = displayName;
      $this.render(_private.members);
   };

   _private.onUserRoleChanged = (id, role) => {
      _private.members[id].isModerator = role === "moderator" ? true : false;
      $this.render(_private.members);
   };

   /**
    * Jitsi Callback onRemoteTrack
    */
   _private.onRemoteTrack = (track) => {
      const userId = track.getParticipantId();
      const type = track.getType();
      const myId = _private.room.room.myroomjid.split("/")[1];
      if (myId == userId) return;
      _private.members[userId]["tracks"][type] = track;
      track.attach(_private.members[userId].video);
      $this.render(_private.members);
   };

   /**
    * Jitsi Callback onRemoteRemoveTrack
    */
   _private.onRemoteRemoveTrack = (track) => {
      const userId = track.getParticipantId();
      const type = track.getType();
      const myId = _private.room.room.myroomjid.split("/")[1];
      if (myId == userId) return;
      _private.members[userId]["tracks"][type] = null;
      track.detach(_private.members[userId].video);
      $this.render(_private.members);
   };

   /**
    * Jitsi Callback onLocalTracks
    */
   _private.onLocalTracks = (tracks) => {
      console.log("Jitsi - Local Tracks");
      for (let i in tracks) {
         const track = tracks[i];
         const type = track.getType();
         const userId = _private.room.room.myroomjid.split("/")[1];
         _private.room.addTrack(track);
         _private.members[userId]["tracks"][type] = track;
         track.attach(_private.members[userId].video);
         $this.render(_private.members);
      }
   };

   /**
    * Set LocalTracks
    * @param {*} tracks
    */
   this.setLocalTracks = async (trackOptions) => {
      options.trackOptions = Object.assign(options.trackOptions, trackOptions);
   };

   /**
    * Jitsi Callback onConferenceJoined
    */
   _private.onConferenceJoined = () => {
      console.log("Jitsi - Conference Joined");
      _private.room.setStartMutedPolicy({ audio: false, video: false });
      _private.room.setDisplayName(options.displayName);
      if (_private.room.isModerator()) {
         _private.room.lock(_private.roomPassword);
      }

      // Create Local User
      const userId = _private.room.room.myroomjid.split("/")[1];
      _private.members[userId].isLocalUser = true;
      _private.members[userId].isModerator = _private.room.isModerator();
      _private.members[userId].displayName = options.displayName;
      $this.render(_private.members);

      // Stream LocalTracks
      setTimeout(() => {
         JitsiMeetJS.createLocalTracks(options.trackOptions).then(_private.onLocalTracks);
      }, 1000);
   };

   /**
    * Create new Member
    */
   _private.addMember = (userId) => {
      let videoElement = document.createElement("video");
      videoElement.setAttribute("id", "jitsi_webcam_stream_user_" + userId);
      videoElement.setAttribute("class", "jitsi_webcam_stream");

      _private.members[userId] = {
         id: userId,
         displayName: "",
         isModerator: false,
         isLocalUser: false,
         idRemoteUser: false,
         video: videoElement,
         tracks: {
            audio: null,
            video: null,
         },
      };
      $this.render(_private.members);
   };

   // OverRide Methodes
   this.render = (members) => {};
   this.connected = () => {};
   this.disconnected = () => {};

   $this.init();
};
