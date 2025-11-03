# ITWS-2110-F25-SawyerMontembeau-Lab6

This REPO contains PHP calculator created for Lab 6 of ITWS-2110 Web Sys

Questions:
-------------------------------------

1. The three classes I created (Subtraction, Division, and Multiplication) inherit from the Opertation class, similar to Addition. This allows for them to access Operator's constructor and properties. Each of these classes implement their own versions of two inherited functions, operate and getEquation. The operate function is what performs the specific math returning the result. The getEquation function builds the equation string, using the operate function to put the result of the calculation at the end of the string. On a button click, the flow of execution is as follows: 
    - Browser sends HTTP POST request to lab6.php
    - The PHP begins executing
    - The if statement (if($_SERVER['REQUEST_METHOD'] == 'POST') {) is marked as true
    - The script assigns the op1 and op2 to what was in the input boxes
    - The script enters the try block and finds the correct object
    - The correct object is instantiated and the two methods are invoked
    - The operation check is finished
    - The HTML is rendered with the result displayed

2. If we used GET instead of POST, rather than the data being sent in the body of the HTTP request, it would be attatched to the URL as a quesry string. This also would make the script have to read from the GET array rather than the POST array. Using POST in this scenario is better because GET is for retrieving data but POST is for changing state / performs an action on the server. 

3. Instead of giving each submit button a different name, you give them all the same name (like "operation") and use the value to tell them apart. Then, in the PHP, you only have to check for one variable ($_POST['operation']) and use a switch statement to handle the logic.