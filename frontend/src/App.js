import { Button, Card, Col, Input, Row } from "antd";
import { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAil67AL9_tleWhEeZqlLtNrFLoMdvka3s",
  authDomain: "fir-rtc-bab7a.firebaseapp.com",
  databaseURL: "https://fir-rtc-bab7a-default-rtdb.firebaseio.com",
  projectId: "fir-rtc-bab7a",
  storageBucket: "fir-rtc-bab7a.appspot.com",
  messagingSenderId: "940858148085",
  appId: "1:940858148085:web:4d8820566d63cdc957b1bc",
  measurementId: "G-MTT8ZMDJLT",
};

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
let pc = new RTCPeerConnection(servers);

function App() {
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const [token, setToken] = useState(null);

  const createOffer = async () => {
    // Reference Firestore collection
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    setToken(callDoc.id);

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentLocalDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  };

  const handleMedia = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    const remoteStream = new MediaStream();

    // Push tracks from localStream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remoteStream, add them to video element
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localStreamRef.current.srcObject = localStream;
    remoteStreamRef.current.srcObject = remoteStream;
  };

  const handleAnswer = async () => {
    const callDoc = firestore.collection("calls").doc(token);
    console.log("🚀 ~ file: App.js ~ line 106 ~ handleAnswer ~ token", token);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log("change in answerBtnClicked", change);
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  return (
    <Row>
      <Col>
        <video ref={localStreamRef} autoPlay />
        local
      </Col>
      <Col>
        <video ref={remoteStreamRef} autoPlay />
        remote
      </Col>
      <Row>
        <Col>
          <Card>
            <Input value={token} onChange={handleChange} />
            <Button shape="round" onClick={handleMedia}>
              Open Camera
            </Button>
            <Button type="primary" shape="round" onClick={handleAnswer}>
              Answer Call
            </Button>
            <Button shape="round" onClick={createOffer}>
              Create Offer
            </Button>
          </Card>
        </Col>
      </Row>
    </Row>
  );
}

export default App;
