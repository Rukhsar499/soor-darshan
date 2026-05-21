const express = require("express");
const path = require("path");
const crypto = require("crypto");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/pay", async (req, res) => {

    const txnid = "TXN" + Date.now();

    const amount = "2000";

    const productinfo = "Music Event";

    const firstname = req.body.name;

    const email = req.body.email;

    const phone = req.body.phone;

    const key = process.env.MERCHANT_KEY;

    const salt = process.env.SALT;

    const surl = "http://localhost:5000/success";

    const furl = "http://localhost:5000/failure";

    const hashString =
        key +
        "|" +
        txnid +
        "|" +
        amount +
        "|" +
        productinfo +
        "|" +
        firstname +
        "|" +
        email +
        "|||||||||||" +
        salt;

    const hash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

    res.send(`
        <form action="https://testpay.easebuzz.in/pay/secure" method="POST" id="paymentForm">

            <input type="hidden" name="key" value="${key}" />
            <input type="hidden" name="txnid" value="${txnid}" />
            <input type="hidden" name="amount" value="${amount}" />
            <input type="hidden" name="productinfo" value="${productinfo}" />
            <input type="hidden" name="firstname" value="${firstname}" />
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="phone" value="${phone}" />
            <input type="hidden" name="surl" value="${surl}" />
            <input type="hidden" name="furl" value="${furl}" />
            <input type="hidden" name="hash" value="${hash}" />

        </form>

        <script>
            document.getElementById('paymentForm').submit();
        </script>
    `);
});

app.post("/success", (req, res) => {
    res.send("Payment Successful");
});

app.post("/failure", (req, res) => {
    res.send("Payment Failed");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});