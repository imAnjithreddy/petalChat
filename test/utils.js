'use strict';

const config  = require('../config');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

beforeEach((done)=>{
    function clearDB(){
        console.log("called before each");
        for(let i in mongoose.connection.collections){
            console.log("called");
            
            mongoose.connection.collections[i].remove(()=>{
                console.log("deleted");
            });
        }
        return done();
    }
    
    if(mongoose.connection.readyState  == 0){
        mongoose.connect(config.db.test,(err)=>{
            if(err){
                throw err;
            }
            return clearDB();
        });
    }else{
        return clearDB();
    }
});

afterEach((done)=>{
    console.log("called after each");
    mongoose.disconnect();
    return done();
})