const nodemailer = require('nodemailer');

class MailService {

constructor(){
     this.transporter = nodemailer.createTransport({
          host:process.env.SMP_HOST,
          port:process.env.SMP_PORT,
          secure:false,
          auth:{
               user:process.env.SMP_USER,
               pass:process.env.SMP_PASS,
          }
     })
}

     async sendActivationMail(to , link){
          await this.transporter.sendMail({
               from:process.env.SMP_USER,
               to,
               subject:`activation mail ` + process.env.API_URL,
               text:'',
               html: 
                    `
                         <div>
                              <h1>
                                   to activate follow the link
                              </h1>
                              <a href=${link}>${link}</a>
                         </div>
                    `
          })
     }
}

module.exports = new MailService();