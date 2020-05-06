const sgMail = require('@sendgrid/mail');

/* SG API KEY*/
// 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
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'apykwan@hotmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with our app.`
    })
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'apykwan@hotmail.com',
        subject: "We will miss you",
        text: `${name}, why the hell did you cancel our service? You will regret it!!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};

// sgMail.send({
//     to: 'apkwan317@gmail.com',
//     from: 'apykwan@hotmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope this one actually get to you'
// })
//     .then(data => {
//         console.log('Message Sent!', data);
//     })
//     .catch(error => {
//         console.log(error);
//     });