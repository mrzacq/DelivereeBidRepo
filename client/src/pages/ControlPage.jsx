import React, { useState, useEffect, useRef } from 'react'
import {Navbar} from '../components'
import io from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {transporterById, patchTrackingLogById, fetchProfileShipper, fetchPostById, fetchShippersById, postShipperRemove} from '../store/index.js'
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
  } from 'react-places-autocomplete';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import './controlPage.css'
import { Button } from 'react-bootstrap';

const mapStyles = {
    width: '100%',
    height: '100%'
  };

function ControlPage (props) {
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState([]);
    const [isMyRoom, setIsMyRoom] = useState(false)
    const [roomName, setRoomName] = useState('')
    const [yourID, setYourID] = useState();
    const [usernameId, setUsername] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const {id} = useParams()
    console.log(id, 'id')
    const arrId = id.split('_')
    const role = arrId[0]
    const username = arrId[1]
    const userId = arrId[2]
    const email = arrId[3]
    const transporterId = arrId[4]
    const bidID = localStorage.getItem("bidId")
    const postID = localStorage.getItem("postId")
    const history = useHistory()
    //ALTERNATIVE 2 ==START==
    const [outputMessage, setOutputMessage] = useState('')
    const [outputRoomName, setOutputRoomName] = useState('')
    const [outputUsers, setOutputUsers] = useState('')
    const [arrOutputMessages, setArrMessages] = useState([])
    //ALTERNATIVE 2 ==END==


    const shipper = useSelector((state) => state.shipper)
    const post = useSelector((state) => state.post[0])
    console.log(shipper, post , 'ini shipper dan posttttttttttttttttttttttttttt')


    const transporter = useSelector((state) => state.transporterId)
    console.log(transporter, 'ini transporter control')
    const profile_shipper = useSelector((state) => state.profile_shipper)
    console.log(profile_shipper, 'ini shipper di control')

    let [address, setAddress] = useState('')


    const socketRef = useRef();
    console.log(message)

    useEffect(() => {
        if(role === 'transporter' && transporterId) {
            dispatch(fetchProfileShipper(transporterId))
        } else if(role === 'shipper' && transporterId) {
            dispatch(transporterById(transporterId))
        }

        if(postID) {
            dispatch(fetchPostById(postID))
        }

        if(bidID) {
            dispatch(fetchShippersById(bidID))
        }





        socketRef.current = io.connect('http://localhost:3000');




        //ALTERNATIVE 2 ==START=========

        // Join chatroom
        if(role === 'transporter'){
            socketRef.current.emit('joinRoom', { username, room: `shipper_${transporterId}&transporter_${userId}` });
        } else {
            socketRef.current.emit('joinRoom', { username, room: `shipper_${userId}&transporter_${transporterId}` });
        }


        // Get room and users
        socketRef.current.on('roomUsers', ({ room, users }) => {
            setOutputRoomName(room);
            setOutputUsers(users);
        });



        // Message from server
        socketRef.current.on('message', message => {
            console.log(message);
            setOutputMessage(message);
            appendMessage(message)




              // Scroll down

            const chatMessages = document.querySelector('.msg_card_body');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })

        //ALTERNATIVE 2 ==END==========

      }, []);


      //ALTERNATIVE 2 ==START=======
        // Message submit
        function sendMessageAlt (e) {
            e.preventDefault();

            // Get message text
            let msg = message;

            msg = msg.trim();

            if (!msg){
                return false;
            }

            // Emit message to server
            socketRef.current.emit('chatMessage', msg);
            setMessage('')
        }

        console.log(outputMessage)



        function appendMessage(message) {
            let div;

            if(username === message.username) {
                div = document.createElement('div');
                div.classList.add('d-flex');
                div.classList.add('justify-content-start');
                div.classList.add('mb-4');

                const divChild = document.createElement('div');
                divChild.classList.add('msg_cotainer');
                divChild.innerText = `${message.username}: ${message.text}`
                div.appendChild(divChild);
            } else {
                div = document.createElement('div');
                div.classList.add('d-flex');
                div.classList.add('justify-content-end');
                div.classList.add('mb-4');

                const divChildSend = document.createElement('div');
                divChildSend.classList.add('msg_cotainer_send');
                divChildSend.innerText = `${message.username}: ${message.text}`
                div.appendChild(divChildSend);
            }


                document.querySelector('.msg_card_body').appendChild(div);

            // document.querySelector('.msg_card_body').appendChild(div);

          }
      //ALTERNATIVE 2 ==END=======



      function handleChange(e) {
        setMessage(e.target.value);
    }

    //G MAPS

    const [latitude, setLatitude] = useState(-6.2087634)
    const [longitude, setLongitude] = useState(106.845599)

    const handleSearchChange = address => {
        setAddress(address)
    };

    const handleSelect = address => {
        setAddress(address)
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng)
                setLatitude(latLng.lat);
                setLongitude(latLng.lng);
            })
            .catch(error => console.error('Error', error));
    };

    const handleSubmitLoc = e => {
        e.preventDefault();
        const city = address.split(',')
        dispatch(patchTrackingLogById(postID, {tracking_log: city[0]}))
        setAddress('')
    }

    function removeBid (e, bidId) {
        e.preventDefault()
        dispatch(postShipperRemove(bidId))
        history.push('/shipper')
    }




    if((!shipper || !post ) && role === 'transporter') {
        return(
            <div>
                <h3>Control Page</h3>
                <h1>You have delivered the items</h1>
            </div>

        )
    }


    return (
        <div >
            {/* <Navbar/> */}
            <div className="container-fluid h-100 mt-3">
                <div className="stepwizard">
                    {   role === 'shipper' &&
                        <div className="stepwizard-row setup-panel">
                            <div className="stepwizard-step">
                                <div  className="btn btn-secondary btn-circle" disabled="disabled">
                                    <span className="glyphicon glyphicon-envelope"></span>
                                </div>
                                <p>{shipper.from}</p>
                            </div>
                            <div className="stepwizard-step">
                                <div className="btn btn-secondary btn-circle" id="ProfileSetup-step-2">
                                    <span className="glyphicon glyphicon-user"></span>
                                </div>
                                <p>
                                    { post &&
                                        post.tracking_log
                                    }

                                </p>
                            </div>
                            <div className="stepwizard-step">
                                <div  className="btn btn-secondary btn-circle"  disabled="disabled" id="Security-Setup-step-3">
                                    <span className="glyphicon glyphicon-ok"></span>
                                </div>
                                <p>
                                    {
                                        post && shipper &&

                                            post.tracking_log === shipper.to
                                            ? 'Delivered'
                                            : shipper.to
                                    }

                                </p>
                            </div>
                        </div>
                    }


                </div>
                <div className="row justify-content-center h-100 contact-in mt-5 mb-5">
                    <div className="col-md-4 col-12 col-xl-8 chat">
                        {/* {   isMyRoom && */}
                        <div className="card card-chat">
                            <div className="card-header-chat msg_head">
                                <div className="d-flex bd-highlight">
                                    <div className="user_info">
                                        <span className='text-primary'>To: {username}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body msg_card_body">


                                {/* <div className="d-flex justify-content-start mb-4">
                                    <div className="msg_cotainer">
                                    {outputMessage.username}: {outputMessage.text}
                                    </div>
                                </div> */}


                                 {/* {messages.map((message, index) => {
                                    if(message.id === yourID ) {
                                        return (
                                            <div className="d-flex justify-content-start mb-4" key={index}>
                                                <div className="msg_cotainer">
                                                    {message.body}
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div className="d-flex justify-content-end mb-4" key={index}>
                                            <div className="msg_cotainer_send">
                                                {message.body}
                                            </div>
                                        </div>
                                        )
                                    })

                                } */}



                            </div>
                            <div className="card-footer-chat">
                                <form onSubmit={(e) => sendMessageAlt(e)}>
                                    <div className="input-group">

                                        <textarea name="" className="form-control type_msg" value={message} onChange={handleChange} placeholder="Say something..." ></textarea>
                                        <button type='submit' className="btn">
                                            <span className="input-group-text send_btn"><i className="fas fa-location-arrow"></i></span>
                                        </button>


                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                    <div className="col-md-6 col-xl-4 map col-12">
                        {   role === 'transporter' &&
                            <div className="card map-div">
                                <iframe
                                width="100%"
                                height="400"
                                frameborder="0"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAaoKpi0CH9Ur9s7sVNfyHMN8ANlLa6JIw&center=${latitude}
                                ,${longitude}&maptype=satellite&q=a`}
                                allowfullscreen>
                                </iframe>
                                {/* {
                                    // let latlon = position.coords.latitude + "," + position.coords.longitude;
                                    latitude && longitude ?
                                    <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude +','+longitude}
                                    &zoom=14&size=600x400&sensor=false&markers=color:red%7C${latitude + ',' + longitude}
                                    &key=AIzaSyAaoKpi0CH9Ur9s7sVNfyHMN8ANlLa6JIw`} alt=''></img> : null
                                } */}
                                <div className="card-body">
                                    <h4 className="card-title mx-0 text-left">Update Location</h4>
                                    <form>
                                        <div className="ml-1 row d-flex justify-content-between">

                                            <PlacesAutocomplete
                                                value={address}
                                                onChange={handleSearchChange}
                                                onSelect={handleSelect}
                                                >
                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                    <div>
                                                        <input
                                                        {...getInputProps({
                                                            placeholder: 'Search Places ...',
                                                            className: 'location-search-input',
                                                        })}
                                                        />
                                                        <div className="autocomplete-dropdown-container">
                                                        {loading && <div>Loading...</div>}
                                                        {suggestions.map(suggestion => {
                                                            const className = suggestion.active
                                                            ? 'suggestion-item--active'
                                                            : 'suggestion-item';
                                                            // inline style for demonstration purpose
                                                            const style = suggestion.active
                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                            return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                className,
                                                                style,
                                                                })}
                                                            >
                                                                <span>{suggestion.description}</span>
                                                            </div>
                                                            );
                                                        })}
                                                        </div>
                                                    </div>
                                                    )}
                                            </PlacesAutocomplete>
                                            <Button onClick={handleSubmitLoc} className="px-1 p-0 ml-1" style={{height: '30px'}} variant="primary">Update Location</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        
                        {
                            role === 'shipper' &&
                            <div className="card mb-3">
                                    <div className="card-body">
                                        <h4 className="card-title">Contact</h4>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {
                                                role === 'transporter'
                                                ? profile_shipper.username
                                                : transporter.username
                                            }
                                        </h6>
                                        <div className="card-text">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><i class="fas fa-clock mr-2 text-center"></i></td>
                                                        <td>
                                                            {
                                                                role === 'transporter'
                                                                ? profile_shipper.email
                                                                : transporter.email
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                        }

                        { post && shipper && post.tracking_log === shipper.to && role === 'shipper' &&
                            <div>
                                <div class="btn-group btn-block" role="group" aria-label="Basic example">
                                    {/* <button type="button" class="btn btn-danger">Complaint</button> */}
                                    <button onClick={(e) => removeBid(e, bidID)} type="button" class="btn btn-success">Yeayy, your order has been deliverd!</button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ControlPage