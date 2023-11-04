# JWT-Auth Express API

This tutorial is a 3 branch/step tutorial in developing a robust API. A firm understanding of an Express API will be demonstrated and become quite evident in this 3 p part development proccess. How webtokens work and how security is implemented will be understood when you complete this proccess. How to handle authorization/roles for users as part of authentificaton. Error handling how to set a robust and quite customizable error handling to help you find and diagnose the difficulat to locate errors. How to implement a sound logging system, for what ever you want to monitor (requests, types of user request errors, and server errors). Also a robust testing javascript file I developed to hit my server with requests (get & post).

You can find the detailed explainations and instructions at the following web page.
[API Tutorial Page](https://lewislwood.github.io/jwt-auth-role-express/)

There are plenty of other instructional repositories and medai based ones.  This one focuses on explaining how express authentificaton & middleware work. Many may have trouble getting how things work, especially when they can only perceive a line at a time. They miss that holistic view. Here I evolove an API that demonstrates the route handling and middleware.

I trimmed away all unneccessary tech in order to simplify your focus, in hopes of you following what is going on.

The second brand (role) I enhance the authentification branch and increase payload with roles. A few more middle ware functions. A middleware function that has parameters, but returns a controller. That returned controller has access to those parameters. A nice trick that opens up more. It takes advantage of javascripts functions are variables until you place a parenthesis to invoke them.

The final branch Model View Controller branch. I put controllers, routes, and middleware where they belong. Making code smaller and specialized. Added two types of logging. Morgan and Winston logging packages.  Also added error handling and explain in great detail how to implemnt it and how it owrks.
