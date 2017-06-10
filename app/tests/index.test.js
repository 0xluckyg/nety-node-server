const {signupTest, loginTest, socketConnectTest} = require('./authentication.test');
const {updateTest, getUserByIdTest, getUserByTokenTest} = require('./user.test');
const {deleteChatTest, getMessagesTest, readMessageTest, sendMessageTest, getChatroomsTest} = require('./chat.test');
const {logoutTest, blockTest, unblockTest, discoverySettingTest} = require('./settings.test');
const {getNetworkTest, updateNetworkTest} = require('./network.test');
const {getContactsTest, deleteContactTest} = require('./contact.test');

//login
// signupTest();
// loginTest();
// socketConnectTest();

// //user
// updateTest();
// getUserByTokenTest();
// getUserByIdTest();

// //settings
// logoutTest();
// blockTest();
// unblockTest();
// discoverySettingTest();

// //network
// getNetworkTest(); //TODO: pagination, sort
// updateNetworkTest();

// //contact
// getContactsTest(); //TODO: pagination, sort
// deleteContactTest();

//TODO: complete it
//chat
sendMessageTest();
// getMessagesTest(); //TODO: pagination, sort
// readMessageTest();
// getChatroomsTest(); //TODO: pagination, sort
// deleteChatTest();