# DevTinder APIs

authRouter
- POST /signup
- POST /login
- Post /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


connectionRequestRouter
- POST /request/send/:status/:userId

- POST /request/review/:status/:requestId

/userRouter
- GET /user/requests
- GET /user/connection
- GET /feed ->It get the profile of all the users in our platform

- status : 
    ingnore -> User as ingone the profile
    interseted -> User as interest the profile
    accepted -> User as accepted the profile
    rejected -> User as rejected the profile

