# SIGN IN

## /signup (post)

> parameter: Json </br>
age: Number </br>
name: String </br>
email: String </br>
password: String </br>

> return: Json </br>
token: String </br>
res.headers[‘x-auth’] </br>
body: Json </br>
res.body </br>

# LOG IN

## /login (post)

parameter: Json
email: String
password: String

return: Json
token: String
	res.headers[‘x-auth’]
body: Json
	res.body

# CONNECT TO SOCKET

## connecting to socket

parameters: String
query string: String
	‘token=usertoken&userId=userid’

function:
const socket = io.connect(url, {
	'query': 'token=' + res.headers[‘x-auth'] + ‘&userId=’ + res.body._id
});

## check if connected

socket.on('connect', () => { //DO SOMETHING });

# UPDATE USER

## /self/update (emit)
description: update self information

parameter: Json
	refer to user schema in ‘models’

## /self/update/success (on)
description: check success of updating self information

return: Json
	updated version of user

## /self/update/fail (on)
description: check failure of updating self information

return: String
	error message

## /user/update (on)
description: check update of other user’s information

return: Json
	updated values of the user, with user _id

#GET USER BY TOKEN

## /self/getByToken (emit)
description: get self information by token

parameter: Nothing

## /self/getByToken/success (on)
description: check success of getting self information by token

return: Json
	everything excluding token, chatrooms, contacts, password, and blocked

## /self/getByToken/fail (on)
description: check failure of getting self information by token

return: String
	error message

# GET USER BY ID

## /user/getById (emit)
description: get user information by id

parameter: String
	_id of user to get

## /user/getById/success (on)
description: check success of getting user information by id

return: Json
	everything excluding token, chatrooms, contacts, password, and blocked

## /user/getById/fail (on)
description: check failure of getting user information by id

return: String
	error message

# NETWORK

## /self/getNetwork (emit)
description: get users 10km around self

parameter: Array of floats
	[longitude, latitude]

## /self/getNetwork/success (on)
description: check success of getting users 10km around self

return: Array of objects
	array of users excluding token, chatrooms, contacts, password, and blocked

## /self/getNetwork/fail (on)
description: check failure of getting users 10km around self

return: String
	error message

## /self/updateLocation (emit)
description: update location of self

parameter: Array of floats
	[longitude, latitude]

## /self/updateLocation/success (on)
description: check success of updating location of self

return: Array of floats
	New location of the user
	[longitude, latitude]

## /self/updateLocation/fail (on)
description: check failure of updating location of self

## /user/updateLocation (on)
description: check other user’s update of location when the other user gets inside 10km range

return: Json
	user except token, chatrooms, contacts, password, and blocked

# SETTINGS

## /self/blockUser (emit)
description: block user

parameter: String
	_id of the user to block

## /self/blockUser/success (on)

return: none

## /self/blockUser/fail (on)

return: String
	error message

## /user/blocked (on)

return: String
	_id of the user who blocked self

## /self/unblockUser (emit)
description: unblock user

parameter: String
	_id of the user to unblock

## /self/unblockUser/success (on)

return: none

## /self/unblockUser/fail (on)

return: String
	error message

## /user/unblocked (on)

return: String
	_id of the user who unblocked self

## /self/changeDiscoverable (emit)
description: changing discoverable status of self

parameter: Boolean
	true or false depending on whether user switches discoverable setting on/off

## /self/changeDiscoverable/success (on)

return: Boolean
	value of the user’s discoverable

## /self/changeDiscoverable/fail (on)

return: String
	error message

## /user/changedDiscoverable/ (on)

return: Object
	{_id: id of user who changed discoverable setting, discoverable: true or false}

## /self/logout (emit)

parameter: none

## /self/logout/success (on)

return: none

## /self/logout/fail (on)

return: String
	error message

## /user/loggedOut (on)

return: String
	_id of the user who logged out

# CONTACTS

## /self/getContacts (emit)

## /self/getContacts/success (emit)

## /self/getContacts/fail (emit)


# CHATS

## /self/sendMessage (emit)

## /self/sendMessage/success (on)

## /self/sendMessage/fail (on)

## /user/message (on)

## /self/deleteChat (emit)

## /self/deleteChat/success (on)

## /self/deleteChat/fail (on)




