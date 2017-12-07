const loginApi="http://192.168.1.103:8081/Login",
userInfoApi="https://192.168.1.102/auth/connect/userinfo",
guestUser={
            "id" : "Guest_123",
            "guest" : "true",
            "username" : "Guest",
            "profilepicurl" : "",
            "roles" : []
};

module.exports={
    loginApi,
    userInfoApi,
    guestUser
}