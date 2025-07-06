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

- Pagination
- GET /feed?page=1&limit=10 -> first 10 Users 1-10 -> .skip(0).limit(10)
- GET /feed?page=2&limit=10 -> Next 10 Users 11-20 -> .skip(10).limit(10)
- GET /feed?page=3&limit=10 -> Next 10 Users 11-20 -> .skip(20).limit(10)

formula for skip
skip = (page-1)*10

- There are two methods in the mongodb
- skip() -> It means how many document skip from the document
- limit() -> It means how many document i want need 

- status : 
    ingnore -> User as ingone the profile
    interseted -> User as interest the profile
    accepted -> User as accepted the profile
    rejected -> User as rejected the profile

