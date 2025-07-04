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
- POST /request/send/intersted/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

/userRouter
- GET /user/connection
- GET /user/requests
- GET /feed ->It get the profile of all the users in our platform

- status : 
    ingnore -> User as ingone the profile
    interseted -> User as interest the profile
    accepted -> User as accepted the profile
    rejected -> User as rejected the profile

