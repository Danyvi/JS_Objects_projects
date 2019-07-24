// Immediate Invoked Function Expression
// IIFE to close everything from the global scope. Preserve the global scope from whatever we are doing here
(function(){

  // 2 function constructors:
  // the first one responsible for the display
  // the second one for the customer

  /**
   * we are going to attach the display checkfields function (on 'blur' events)
   * The idea is that only when we are filling out the three input fields we are able to submit and create a new customer.
   * Initially, once the page is loaded, we are listening to check the fields and hide the submit button
   */

  // we have to create a new instance of Display
  document
    .addEventListener('DOMContentLoaded', function(){
      const display = new Display();
      display.checkFields();
      display.hideSubmit();
    })
  // After we have submitted the form: add customer on submit
  document
    .getElementById('customer-form')
    .addEventListener('submit', function(event){
      // prevent refresh page on submit
      event.preventDefault();
      // grab the values that are accessible name, course, author
      // console.log(this); // 'this' refers to object, the 'customer-form', because it is the form that is calling the function
      const name = this.querySelector('.name');
      const course = this.querySelector('.course');
      const author = this.querySelector('.author');
      // Since we know that there are already some values in the fields,
      // we don't need to check them again.
      // We place them in the customer constructor function
      const customer = new Customer(name.value, course.value, author.value);
      // console.log(customer); // new instance of customer
      // since we are in 2 different function we can name the instance as 'display'
      const display =  new Display();
      // add 2 methods to a Display prototype and call them
      display.feedback(customer);
      display.clearFields();
    })





  /* Display constructor function */

  // first specify the properties
  function Display(){
    this.name = document.getElementById('name');
    this.course = document.getElementById('course');
    this.author = document.getElementById('author');
    this.customers = document.querySelector('.customer-list');
  }
  //then attach the methods checkFields to the prototype
  Display.prototype.checkFields = function() {
    // console.log(this); // with 'this' we are referring to the actual constructor function
    this.name.addEventListener('blur', this.validateField)
    this.course.addEventListener('blur', this.validateField)
    this.author.addEventListener('blur', this.validateField)
  }
  // and validateField method to the prototype
  Display.prototype.validateField = function(){
    // console.log(this); // 'this' is referring back to the input object not to the constructor
    if(this.value === '') {
      this.classList.remove('complete');
      this.classList.add('fail');
    } else {
      this.classList.add('complete');
      this.classList.remove('fail');
    }
    // We want to be able to submit only if all inputs are completed
    // each and every time we're going to call 'validateField' we'll use querySelector
    // where we are going to select all the classes of 'completed'
    // and if the length = 3 then we are going to remove the submit disabled and turn it to true
    const complete = document.querySelectorAll('.complete');
    // console.log("Logged Output: Display.prototype.validateField -> complete", complete)
    // console.log(complete.length);

    if (complete.length === 3) {
      document.querySelector('.submitBtn').disabled = false;
    } else {
      document.querySelector('.submitBtn').disabled = true;
    }
  };

  // disable submit button
  // it's going to run every time the DOM Content has been loaded
  Display.prototype.hideSubmit = function() {
    const btn = document.querySelector('.submitBtn');
    btn.disabled = true;
  }

  // show loading and feedback
  Display.prototype.feedback = function(customer){
    const feedback = document.querySelector('.feedback');
    const loading = document.querySelector('.loading');

    // we add classes to the .feedback and .loading classes
    feedback.classList.add('showItem','alert', 'alert-success');
    loading.classList.add('showItem');

    // select button and make it disabled again so we can not submit empty values
    // we use a self variable because within this feedback method
    // we also want to call a function of setTimeout to hide the calculating feedback and loading
    const self = this; // 'this' points to Display constructor function
    // we need to be aware of the context because the value of 'this' will change
    // NOT VALID WITH THE USE OF ARROW FUNCTION
    self.hideSubmit();

    setTimeout(function(){
      feedback.classList.remove('showItem','alert', 'alert-success');
      loading.classList.remove('showItem');
    },800)
    // we use self otherwise 'this' point to the global window obj
    // with error 'this.addCustomer is not a function'
    self.addCustomer(customer)
  };

  // creating a method that display the customer
  Display.prototype.addCustomer = function(customer){
    // console.log(customer);

    // get a random image
    const random = this.getRandom();

    const div = document.createElement('div');
    div.classList.add('col-11', 'mx-auto', 'col-md-6', 'my-3', 'col-lg-4');
    div.innerHTML = `
    <div class="card text-left">
      <img src="img/cust-${random}.jpg" class="card-img-top" alt="" />
      <div class="card-body">
        <!-- customer name -->
        <h6 class="text-capitalize ">
          <span class="badge badge-warning mr-2">name :</span
          ><span id="customer-name"> ${customer.name}</span>
        </h6>
        <!-- end of customer name -->
        <!-- customer name -->
        <h6 class="text-capitalize my-3">
          <span class="badge badge-success mr-2">course :</span
          ><span id="customer-course">
            ${customer.course}
          </span>
        </h6>
        <!-- end of customer name -->
        <!-- customer name -->
        <h6 class="text-capitalize">
          <span class="badge badge-danger mr-2">author :</span
          ><span id="course-author"> ${customer.author}</span>
        </h6>
        <!-- end of customer name -->
      </div>
    </div>
    `;
    this.customers.appendChild(div);

  }

  // random number
  Display.prototype.getRandom = function(){
    let random = Math.floor(Math.random()*5+1);
    return random;
  }

  Display.prototype.clearFields = function() {
    // console.log(this); // 'this' is pointing back to the Display constructor function
    this.name.value = '';
    this.course.value = '';
    this.author.value = '';

    // remove the classes 'complete' and 'fail' so we can have a clean slate for new values
    this.name.classList.remove('complete', 'fail');
    this.course.classList.remove('complete', 'fail');
    this.author.classList.remove('complete', 'fail');
  }
  // Customer Constructor Function
  // responsible for all the instances of the customers that we'll create
  // the idea is that each customer has different values
  // so that's why we are using these properties name, course, author
  // and we are setting them to each of them in the instance
  function Customer(name, course, author){
    this.name = name;
    this.course = course;
    this.author = author;
  }

})();