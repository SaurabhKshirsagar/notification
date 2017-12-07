import im from  'immutable';
import stringHanndler from './index.js';
let schema = {
            type:'string',
            defaultValue:null,
            minLength:5,
            maxLength:20,
            required: false,
            allowsNull:"yes",
            patternValidation:"yes"
         },
field = im.fromJS({
         value : "testString",
         error : "type Missmatch" 
        });


describe('To String', function () {
    it('should be string', function(){
        let result = stringHanndler.toString(field);  
        expect(result).toEqual("testString");
    });
});