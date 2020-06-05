# Tasks-Board-SPA

Keep track / record of your tasks using HTML, JS & CSS.

![mainPage](./mainPage.PNG)

Core Foundations:

1. Users are required to enter both description and date for their task. 
   Entering a specific hour is not a requirement.
   A. I firmly believe that not every task may have or require a specific set hour.
   B. Allowing the user to decide whether they want to set an hour for their task or not.

2. The format of the date is (International Format) Year/Month/Day -- YYYY/MM/DD 
   The reason for choosing the International Format is because the date's interpretation will be different
   from one country to another hence, the choice for this simple numerical date system that would appeal to & be understandable
   by a global audience.

3. The user is allowed to enter any year between 2010 to 2040 due to the following reasons:
   A- Giving the user the freedom to choose whichever date they desire (within the margin, reason explained below),	
      For example, documenting previously done / overdue tasks, future tasks etc...
      Which is why tasks can only be removed manually by clicking the X button.
   B- I'm only letting the user enter a year within this margin, reason being is it's simply unrealistic in my opinion 
      to enter tasks with dates such as years 1900, 1500, 3000, 2200 and so on...

4. The tasks are contained inside an array stored in localStorage.

5. The users are allowed to enter any kind of task they desire with no restrictions on characters / numbers / letters.
   But, I do make one minor change to the tasks, by changing the very first letter to a capital letter because that's
   how you start a sentence in English.
   
6. Errors: 2 validations are performed on both task's description and the task's date, in case the user entered
   no input / wrong date pattern. In case an error is found, the wrong input area is marked red and a message regarding
   the error shows up, the area will remain marked red until a valid submit or reset of the form.

7. Notes are added from left to right, newest will be shown on the left.
