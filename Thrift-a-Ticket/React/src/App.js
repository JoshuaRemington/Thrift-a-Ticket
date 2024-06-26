import React, { useEffect, useState } from 'react';
import './App.css'; // Import CSS file for styling

function App() {
    const [venue, setVenue] = useState('');
    const [ticketPrices, setTicketPrices] = useState([]);
    const [bookmarked, setBookmarked] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showLoginScreen, setLoginScreen] = useState(true);
    const [showRegisterScreen, setRegistrationScreen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showBookmarkedTickets, setBookmarkedTickets] = useState(false);
    const [showEmailInUseError, setEmailInUseError] = useState(false);
    const [showLoginError, setLoginError] = useState(false);
    const [stateInitials, setStateInitials] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const showRegisterPage = () => {
        setLoginScreen(false);
        setRegistrationScreen(true);
    }

    const showLoginPage = () => {
        setLoginScreen(true);
        setRegistrationScreen(false);
    }

    useEffect(() => {
        //console.log(ticketPrices.length);
        console.log(ticketPrices);
    }, [ticketPrices]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data === true) {
                    setLoginScreen(false);
                    setPassword('null');
                } else {
                    setLoginError(true);
                }
            } else {
                throw new Error('Failed to post data');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors from the fetch request
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data === 2) {
                    setRegistrationScreen(false);
                    setPassword('null');
                } else if (data === 0) {
                    setEmailInUseError(true);
                }
            } else {
                throw new Error('Failed to post data');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors from the fetch request
        }
    };

    const handleSearch = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/searchTickets/` + venue + `/` + stateInitials, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if(data.length === 0) {
                setError('Couldn\'t find any tickets for that search');
            }
            else if(!response.ok) {
                setError('Couldn\'t find any tickets for that search');
                setLoading(false);
                return;
            }
            else {
                setTicketPrices(data);
            }
        } catch (error) {
            setError('Failed to fetch ticket prices. Please try again later.');
        }
        setLoading(false);
    };

    const bookmark = async (ticket) => {
        ticket.email = email;
        try {
            const response = await fetch('http://localhost:8080/addUserTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticket),
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful response from the API
            } else {
                throw new Error('Failed to post data');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors from the fetch request
        }
    }

    const getBookmark = async () => {
        try {
            const response = await fetch('http://localhost:8080/userTickets/' + email, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookmarked(data);
            } else {
                throw new Error('Failed to post data');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors from the fetch request
        }
    }

    const convertDate = (date) => {
        var string = "";
        var month = date[5] + date[6];
        switch(month) {
            case "01": string += "January"; break;
            case "02:": string += "February"; break;
            case "03": string += "March"; break;
            case "04": string += "April"; break;
            case "05": string += "May"; break;
            case "06": string += "June"; break;
            case "07": string += "July"; break;
            case "08": string += "August"; break;
            case "09": string += "September"; break;
            case "10": string += "October"; break;
            case "11": string += "November"; break;
            case "12": string += "December"; break;
        }
        string += " " + date[8];
        if(date.length >= 10) 
            string += date[9] + " ";

        for(var i = 0; i < 4; i++)
            string += date[i];

        return string;
    }

    const convertTime = (time) => {
        // Split the military time string into hours and minutes
        const [hours, minutes] = time.split(':').map(Number);

        // Check if the hours are greater than 12 to determine AM or PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12;

        // Create the formatted time string
        const normalTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

        return normalTime;
    }

    return (
        <div>
            <div className="banner">
                <div className='logo'>
                    <h1>Thrift-A-Ticket</h1>
                </div>
            </div>
            <div className="container">
                <button onClick={() => { setBookmarkedTickets(true); getBookmark() }}>Show Bookmarked Tickets</button>
                <h2>Concert Ticket Search</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter Event..."
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter State Initials...(ex: CA)"
                        value={stateInitials}
                        onChange={(e) => setStateInitials(e.target.value)}
                    />
                    <button className="search-button" onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && <div className="error">{error}</div>}
                {Array.isArray(ticketPrices) && ticketPrices.length !== 0 && (
                    <div className="ticket-prices">
                        <h2>Ticket Prices</h2>
                        <ul>
                            {ticketPrices.map((ticket, index) => (
                                <li key={index}>
                                    <img src={ticket.img_url}></img>
                                    <strong>  {ticket.artist} ${ticket.price} {convertDate(ticket.date)} {convertTime(ticket.time)}  </strong>
                                    <br></br>
                                    <a href={ticket.purchase_link} target='_blank'>Purchase</a>
                                    <strong> </strong>
                                    <button onClick={() => bookmark(ticket)}>Bookmark</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showLoginScreen && (
                    <div className='just-login-custom'>
                        <div className="banner">
                            <div className='logo'>
                                <h1>Thrift-A-Ticket</h1>
                            </div>
                        </div>
                        <div className='login-info'>
                            <h2>Login </h2>
                            <form onSubmit={handleLogin}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                <br />
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <br />
                                <button type="submit">Login</button>
                            </form>
                            {showLoginError && <p>Email or Password is incorrect</p>}
                            <button onClick={showRegisterPage}>New? Click to register</button>
                        </div>
                    </div>
                )}
                {showRegisterScreen && (
                    <div className='login-screen'>
                        <div className="banner">
                            <div className='logo'>
                                <h1>Thrift-A-Ticket</h1>
                            </div>
                        </div>
                        <div className='login-info'>
                            <h2>Register</h2>
                            <form onSubmit={handleRegistration}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                <br />
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <br />
                                <button type="submit">Register</button>
                            </form>
                            {showEmailInUseError && <p>Email in use</p>}
                            <button onClick={showLoginPage}>Already registered?</button>
                        </div>
                    </div>
                )}
                {showBookmarkedTickets && (
                    <div className="login-screen">
                        <div className="banner">
                            <div className='logo'>
                                <h1>Thrift-A-Ticket</h1>
                            </div>
                        </div>
                        <button className="bookmark-button" onClick={() => setBookmarkedTickets(false)}>Back</button>
                        <h2>Bookmarked Tickets</h2>
                        <ul>
                            {bookmarked.map((ticket, index) => (
                                <li key={index}>
                                    <img src={ticket.img_url}></img>
                                    <strong>  {ticket.artist} - ${ticket.price} - {convertDate(ticket.date)} - {convertTime(ticket.time)} </strong>
                                    <a href={ticket.purchase_link} target='_blank'>Purchase</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

}
export default App;

