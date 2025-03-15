import mongoose from "mongoose";

async function db_connect(url){
    await mongoose.connect(url)
    .then(()=>console.log("Connected"))
    .catch((err)=>console.log(err));
}

export default db_connect;