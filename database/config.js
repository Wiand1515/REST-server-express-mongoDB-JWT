require('colors');
const mongoose = require('mongoose')

const dbConnect = async() => {



    try {

        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online'.yellow)




        
    } catch (err) {
        console.log(err)
        throw new Error('Error a la hora de inciar la DB')        
    }

}


module.exports = {
    dbConnect
}