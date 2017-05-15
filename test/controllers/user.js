'use strict';
var httpMocks = require('node-mocks-http');
const utils = require('../utils');

let chai  = require('chai');
let expect = chai.expect;


let chaiHttp = require('chai-http');
chai.use(chaiHttp);
//let should = chai.should();

let User = require('../../models/user');
let UserController = require('../../controllers/user');
const webUrl =  'https://petalchat-imanjithreddy.c9users.io';
describe('Users',()=>{
    
    describe('/user/getUsers empty',()=>{
        it('should get all users',(done)=>{
            chai.request(webUrl)
            .get('/user/getUsers')
            .end((err,res)=>{
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object');
                done();
            });
        });
    });
    describe('/user/create ',()=>{
        it('should create a user',(done)=>{
            
            let sampleUser = {
                firstName: 'first',
                lastName: 'last',
                email: 'first_last@mail.com',
                displayName: 'firstLast',
                anonName: 'firstAnonName',
                phone: '1234567890',
                bio: 'firstBio',
                status: 'firstStatus'
            };
            
            chai.request(webUrl)
            .post('/user/create')
            .send({user:sampleUser})
            .end((err,res)=>{
                if(err){
                    console.log(err);
                }
                expect(res.status).to.equal(200);
                //expect(res.body).to.have.property('_id');
               /* expect(res.body.email).to.equal('first_last@mail.com');
                expect(res.body.firstName).to.equal('first');*/
                done();
            });
        });
    });
});






/*


'use strict';
var httpMocks = require('node-mocks-http');
const utils = require('../utils');

const chai  = require('chai');



let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let should = chai.should();


const UserController = require('../../controllers/user');
function buildResponse() {
  return httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
}
describe('UserController',()=>{
    describe('Create',()=>{
        it('should create a new user',(done)=>{
            let sampleUser = {
                firstName: 'first',
                lastName: 'last',
                email: 'first_last@mail.com',
                displayName: 'firstLast',
                anonName: 'firstAnonName',
                phone: '1234567890',
                bio: 'firstBio',
                status: 'firstStatus'
            };
            var request  = httpMocks.createRequest({
                method: 'POST',
                url: '/user/42',
                body: {
                    user: sampleUser
                }
            });
            var response = buildResponse();
            response.on('end',()=>{
                var resData = JSON.parse(response._getData());
                expect(resData.email).to.equal('first_last@mail.com');
                done();
            });
            UserController.createUser(request,response);
        });
        it('should update an existing user',(done)=>{
            let sampleUser = {
                firstName: 'first',
                lastName: 'last',
                email: 'first_last@mail.com',
                displayName: 'firstLast',
                anonName: 'firstAnonName',
                phone: '1234567890',
                bio: 'firstBio',
                status: 'firstStatus'
            };
            var request  = httpMocks.createRequest({
                method: 'POST',
                url: '/user/42',
                body: {
                    user: sampleUser
                }
            });
            var response = buildResponse();
            UserController.createUser(request,response);
        });
    });
    
});



*/