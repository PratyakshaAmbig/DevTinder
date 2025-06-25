exports.adminAuth = (req, res, next)=>{
     console.log('Admin auth is getting checked.')
     const token = 'xyz';
     const isAdminAuthorized = token === 'xyz';
     if(!isAdminAuthorized){
         res.status(401).send("Admin is not authorized")
     }else{
          next();
     }
}

exports.userAuth = (req, res, next)=>{
     console.log('User auth is getting checked.')
     const token = 'xyz';
     const isAdminAuthorized = token === 'xyz';
     if(!isAdminAuthorized){
         res.status(401).send("User is not authorized")
     }else{
          next();
     }
}