const expect = require('expect');
const request = require('supertest');
const {app} = require('../index');

const {signupTest, loginTest, socketConnectTest} = require('./authentication.test');
const {updateTest, getUserByIdTest, getUserByTokenTest} = require('./user.test');
const {deleteChatTest, sendMessageTest, getChatroomsTest} = require('./chat.test');
const {logoutTest, blockTest, unblockTest, discoverySettingTest} = require('./settings.test');
const {networkTest} = require('./network.test');
const {getContactsTest, deleteContactTest} = require('./contact.test');

// //login
// signupTest();
// loginTest();
// socketConnectTest();

// //user
// updateTest();
// getUserByTokenTest();
// getUserByIdTest();

// network
// networkTest();

// settings
// logoutTest();
// blockTest();
// unblockTest();
discoverySettingTest();